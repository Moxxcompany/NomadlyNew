// function get(table, key) {
//   return table[key];
// }
// function set(table, key, value) {
//   table[key] = value;
// }
// del should be some mark X instead of del

const increment = async (c, key, val = 1, valueInside) => {
  try {
    if (valueInside) {
      const count = (await get(c, key))?.[val] || 0
      await set(c, key, val, Number(count) + Number(valueInside))
      return
    }

    const count = (await get(c, key)) || 0
    await set(c, key, count + val)
  } catch (error) {
    console.error(`Error increment: ${key} from ${c.collectionName}:`, error)
    return null
  }
}

// Atomic increment using MongoDB $inc — safe for concurrent wallet operations
const atomicIncrement = async (c, key, field, amount) => {
  try {
    await c.updateOne(
      { _id: key },
      { $inc: { [field]: amount } },
      { upsert: true }
    )
    return true
  } catch (error) {
    console.error(`Error atomicIncrement: ${key}.${field} by ${amount} in ${c.collectionName}:`, error)
    return false
  }
}

const decrement = async (c, key) => {
  try {
    const count = (await get(c, key)) || 0
    await set(c, key, count - 1)
  } catch (error) {
    console.error(`Error db decrement ${key} from ${c.collectionName}:`, error)
    return null
  }
}

async function get(c, key) {
  try {
    const result = await c.findOne({ _id: key })
    // console.log({ findIn: c.collectionName, key, result });
    if (result?.val === 0) return 0
    if (result?.val === false) return false
    if (result?.val === null) return null

    return result?.val || result || undefined
  } catch (error) {
    console.error(`Error get: ${key} from ${c.collectionName}:`, error)
    return null
  }
}

async function getAll(c) {
  try {
    const result = await c.find({}).toArray()
    return result
  } catch (error) {
    console.error(`Error getAll: ${c}:`, error)
    return null
  }
}

async function set(c, key, value, valueInside) {
  // Note: This function uses upsert which could have race conditions in high-concurrency scenarios.
  // For critical operations requiring atomicity, consider using MongoDB transactions.
  try {
    if (!c || !c.updateOne) {
      throw new Error('Invalid collection object provided')
    }

    if (key === undefined || key === null) {
      throw new Error('Key cannot be undefined or null')
    }

    let result
    if (valueInside === undefined) {
      result = await c.updateOne({ _id: key }, { $set: { val: value } }, { upsert: true })
    } else {
      result = await c.updateOne({ _id: key }, { $set: { [value]: valueInside } }, { upsert: true })
    }

    // Verify the operation succeeded
    if (!result.acknowledged) {
      console.warn(`Set operation not acknowledged for key: ${key} in ${c.collectionName}`)
    }

    // let a = JSON.stringify(valueInside);
    // a = a === undefined ? '' : ` ${a}`;
    // console.log(`${key}: ${JSON.stringify(value)}${a} set in ${c.collectionName}`);
    return true
  } catch (error) {
    console.error(`Error set: ${key} -> ${JSON.stringify(value)} in ${c.collectionName}:`, error?.message || error)
    
    // Log additional context for debugging
    if (error.code) {
      console.error(`MongoDB error code: ${error.code}`)
    }
    
    return false
  }
}

async function insert(collection, chatId, key, value) {
  try {
    await collection.insertOne({
      chatId: chatId,
      [key]: value,
      timestamp: new Date()
    });
  } catch (error) {
    console.error(`Error setting: ${key} -> ${JSON.stringify(value)} in ${collection.collectionName}:`, error);
  }
}

async function getLatestTransactionByChatId(collection, chatId) {
  try {
    const result = await collection.find({ chatId: chatId })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error getting transaction for chatId ${chatId} from ${collection.collectionName}:`, error);
    return null;
  }
}

async function removeKeyFromDocumentById(collection, chatId, key) {
  try {
    const query = { _id: chatId }; // Query to find the document by _id field
    const update = { $unset: { [key]: "" } }; // Unset the specific key

    const result = await collection.updateOne(query, update);

    if (result.matchedCount === 0) {
      console.log(`No document found with chatId: ${chatId}`);
    } else if (result.modifiedCount === 0) {
      // console.log(`Key: ${key} was not found in document with chatId: ${chatId}`);
    } else {
      console.log(`Successfully removed key: ${key} from document with chatId: ${chatId}`);
    }
  } catch (error) {
    console.error(`Error removing key: ${key} from document with _id: ${chatId}:`, error);
  }
}

async function removeKeysFromDocumentById(collection, chatId, keys) {
  try {
    for (const key of keys) {
      await removeKeyFromDocumentById(collection, chatId, key);
    }
    console.log(`Successfully removed keys: ${keys.join(", ")} from document with chatId: ${chatId}`);
  } catch (error) {
    console.error(`Error removing keys: ${keys.join(", ")} from document with _id: ${chatId}:`, error);
  }
}

async function assignPackageToUser(c, chatId, packageName) {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 12 * 60 * 60 * 1000)

  const newPackage = {
    name: packageName,
    startDate: now,
    expiresAt: expiresAt,
    isActive: true,
  }

  const newReminders = {
    beforeExpireReminderSent: false,
    expireReminderSent: false,
  }

  try {
    const user = await c.findOne({ _id: chatId })

    if (user && user.currentPackage) {
      const updatedPreviousPackages = user.previousPackages || []
      updatedPreviousPackages.push({
        name: user.currentPackage.name,
        startDate: user.currentPackage.startDate,
        expireDate: user.currentPackage.expiresAt,
        status: 'expired',
      })

      await c.updateOne(
        { _id: chatId },
        {
          $set: {
            currentPackage: newPackage,
            reminders: newReminders,
            previousPackages: updatedPreviousPackages,
          },
        },
        { upsert: true },
      )
    } else {
      await c.updateOne(
        { _id: chatId },
        {
          $set: {
            currentPackage: newPackage,
            reminders: newReminders,
            previousPackages: user?.previousPackages || [],
          },
        },
        { upsert: true },
      )
    }

    console.log(`${packageName} package set for user:`, chatId)
  } catch (error) {
    console.error(`Error setting ${packageName} package for ${chatId}:`, error)
  }
}

async function del(c, _id) {
  try {
    const result = await c.deleteOne({ _id })
    // console.log(`Deleted ${result.deletedCount >= 1 ? 'True' : 'False'} in ${c.collectionName}`);
    return result.deletedCount === 1
  } catch (error) {
    console.error('Error del:', error)
    return false
  }
}

module.exports = {
  increment,
  atomicIncrement,
  decrement,
  get,
  set,
  del,
  getAll,
  assignPackageToUser,
  insert,
  removeKeysFromDocumentById
}
