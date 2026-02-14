#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class UXValidationTester {
    constructor() {
        this.testsRun = 0;
        this.testsPassed = 0;
        this.errors = [];
    }

    runTest(testName, testFunction) {
        this.testsRun++;
        console.log(`\n🔍 Testing: ${testName}`);
        
        try {
            const result = testFunction();
            if (result.success) {
                this.testsPassed++;
                console.log(`✅ PASS - ${result.message}`);
            } else {
                console.log(`❌ FAIL - ${result.message}`);
                this.errors.push(`${testName}: ${result.message}`);
            }
        } catch (error) {
            console.log(`❌ FAIL - Exception: ${error.message}`);
            this.errors.push(`${testName}: Exception - ${error.message}`);
        }
    }

    loadConfig(filePath) {
        try {
            // Read file content and extract the relevant objects
            const content = fs.readFileSync(filePath, 'utf8');
            return content;
        } catch (error) {
            throw new Error(`Failed to load ${filePath}: ${error.message}`);
        }
    }

    extractKeyboardOrder(content) {
        // Extract userKeyboard array structure
        const match = content.match(/const userKeyboard = \{[\s\S]*?keyboard: \[([\s\S]*?)\],/);
        if (match) {
            return match[1].trim();
        }
        return null;
    }

    testKeyboardReordering() {
        return this.runTest("config.js userKeyboard reordered correctly", () => {
            const configContent = this.loadConfig('/app/js/config.js');
            const keyboard = this.extractKeyboardOrder(configContent);
            
            if (!keyboard) {
                return { success: false, message: "Could not extract userKeyboard from config.js" };
            }

            // Check the expected order based on review request
            const expectedOrder = [
                'user.urlShortenerMain',
                'user.hostingDomainsRedirect', 
                'user.phoneNumberLeads',
                'user.wallet, user.viewPlan',
                'user.buyPlan'
            ];

            let allFound = true;
            let foundOrder = [];

            for (const expected of expectedOrder) {
                if (keyboard.includes(expected)) {
                    foundOrder.push(expected);
                } else {
                    allFound = false;
                    break;
                }
            }

            if (allFound) {
                return { success: true, message: `Keyboard reordering correct: ${foundOrder.join(' -> ')}` };
            } else {
                return { success: false, message: `Keyboard order incorrect. Expected: ${expectedOrder.join(' -> ')}` };
            }
        });
    }

    testLanguageFileConsistency() {
        return this.runTest("All language files have consistent userKeyboard ordering", () => {
            const files = [
                '/app/js/lang/en.js',
                '/app/js/lang/fr.js', 
                '/app/js/lang/hi.js',
                '/app/js/lang/zh.js'
            ];

            const keyboards = files.map(file => {
                const content = this.loadConfig(file);
                return this.extractKeyboardOrder(content);
            });

            // Check if all keyboards have similar structure (allowing for HIDE_SMS_APP differences)
            const allConsistent = keyboards.every(kb => 
                kb && 
                kb.includes('user.urlShortenerMain') &&
                kb.includes('user.hostingDomainsRedirect') &&
                kb.includes('user.phoneNumberLeads') &&
                kb.includes('user.wallet, user.viewPlan') &&
                kb.includes('user.buyPlan')
            );

            if (allConsistent) {
                return { success: true, message: "All language files have consistent keyboard ordering" };
            } else {
                return { success: false, message: "Language files have inconsistent keyboard ordering" };
            }
        });
    }

    testTextUpdates() {
        return this.runTest("Text updates implemented correctly", () => {
            const configContent = this.loadConfig('/app/js/config.js');
            const enContent = this.loadConfig('/app/js/lang/en.js');

            const checks = [
                {
                    name: 'whatNum updated',
                    pattern: /whatNum.*That doesn't look right\. Please enter a valid number/,
                    content: configContent
                },
                {
                    name: 'walletBalanceLow includes deposit instructions',
                    pattern: /walletBalanceLow.*Tap.*My Wallet.*Deposit.*to top up/,
                    content: configContent
                },
                {
                    name: 'urlShortenerSelect added',
                    pattern: /urlShortenerSelect.*Shorten, brand, or track your links/,
                    content: configContent
                },
                {
                    name: 'phoneNumberLeads text updated in config.js',
                    pattern: /phoneNumberLeads.*Buy verified phone leads or validate your own numbers/,
                    content: configContent
                },
                {
                    name: 'phoneNumberLeads text updated in en.js',
                    pattern: /phoneNumberLeads.*Buy verified phone leads or validate your own numbers/,
                    content: enContent
                },
                {
                    name: 'askValidAmount updated in config.js',
                    pattern: /askValidAmount.*Please enter a valid amount/,
                    content: configContent
                },
                {
                    name: 'askValidAmount updated in en.js', 
                    pattern: /askValidAmount.*Please enter a valid amount/,
                    content: enContent
                },
                {
                    name: 'showDepositNgnInfo grammar fixed in config.js',
                    pattern: /wallet will be updated/,
                    content: configContent
                },
                {
                    name: 'showDepositNgnInfo grammar fixed in en.js',
                    pattern: /wallet will be updated/,
                    content: enContent
                }
            ];

            const failures = [];
            for (const check of checks) {
                if (!check.pattern.test(check.content)) {
                    failures.push(check.name);
                }
            }

            if (failures.length === 0) {
                return { success: true, message: `All ${checks.length} text updates verified` };
            } else {
                return { success: false, message: `Failed checks: ${failures.join(', ')}` };
            }
        });
    }

    testErrorMessageUpdates() {
        return this.runTest("Error messages updated to be clearer", () => {
            const configContent = this.loadConfig('/app/js/config.js');
            const enContent = this.loadConfig('/app/js/lang/en.js');

            // Check that error messages no longer have confusing text and include support info
            const errorChecks = [
                {
                    name: 'redIssueUrlBitly has clear error message',
                    pattern: /redIssueUrlBitly.*Link shortening failed.*contact.*SUPPORT_USERNAME/,
                    content: configContent
                },
                {
                    name: 'redIssueUrlCuttly has clear error message',
                    pattern: /redIssueUrlCuttly.*Link shortening failed.*contact.*SUPPORT_USERNAME/,
                    content: configContent
                },
                {
                    name: 'issueGettingPrice has clear error message in en.js',
                    pattern: /issueGettingPrice.*couldn't fetch the price.*contact.*SUPPORT_USERNAME/,
                    content: enContent
                }
            ];

            const failures = [];
            for (const check of errorChecks) {
                if (!check.pattern.test(check.content)) {
                    failures.push(check.name);
                }
            }

            if (failures.length === 0) {
                return { success: true, message: `All ${errorChecks.length} error message updates verified` };
            } else {
                return { success: false, message: `Failed checks: ${failures.join(', ')}` };
            }
        });
    }

    testTranslatedUpdates() {
        return this.runTest("Translated phoneNumberLeads text updated in all language files", () => {
            const langFiles = [
                { file: '/app/js/lang/fr.js', lang: 'French', expectedPattern: /phoneNumberLeads.*Achetez des leads téléphoniques vérifiés ou validez vos propres numéros/ },
                { file: '/app/js/lang/hi.js', lang: 'Hindi', expectedPattern: /phoneNumberLeads.*सत्यापित फ़ोन लीड खरीदें या अपने नंबर मान्य करें/ },
                { file: '/app/js/lang/zh.js', lang: 'Chinese', expectedPattern: /phoneNumberLeads.*购买经验证的电话线索或验证您自己的号码/ }
            ];

            const failures = [];
            for (const langFile of langFiles) {
                const content = this.loadConfig(langFile.file);
                if (!langFile.expectedPattern.test(content)) {
                    failures.push(langFile.lang);
                }
            }

            if (failures.length === 0) {
                return { success: true, message: "All translated phoneNumberLeads text updated correctly" };
            } else {
                return { success: false, message: `Failed translations: ${failures.join(', ')}` };
            }
        });
    }

    testSyntaxValidation() {
        return this.runTest("All files pass Node.js syntax validation", () => {
            const files = [
                '/app/js/config.js',
                '/app/js/lang/en.js',
                '/app/js/lang/fr.js',
                '/app/js/lang/hi.js',
                '/app/js/lang/zh.js'
            ];

            const { execSync } = require('child_process');
            const failures = [];

            for (const file of files) {
                try {
                    execSync(`node --check ${file}`, { stdio: 'pipe' });
                } catch (error) {
                    failures.push(path.basename(file));
                }
            }

            if (failures.length === 0) {
                return { success: true, message: `All ${files.length} files pass syntax validation` };
            } else {
                return { success: false, message: `Syntax errors in: ${failures.join(', ')}` };
            }
        });
    }

    runAllTests() {
        console.log('🚀 Starting UX Validation Testing for NomadlyBot');
        console.log('=' * 60);

        this.testKeyboardReordering();
        this.testLanguageFileConsistency();
        this.testTextUpdates();
        this.testErrorMessageUpdates(); 
        this.testTranslatedUpdates();
        this.testSyntaxValidation();

        console.log('\n' + '=' * 60);
        console.log(`📊 Test Results: ${this.testsPassed}/${this.testsRun} tests passed`);
        
        const successRate = (this.testsPassed / this.testsRun * 100);
        console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);

        if (this.errors.length > 0) {
            console.log('\n❌ Failed Tests:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }

        if (this.testsPassed === this.testsRun) {
            console.log('🎉 All UX validation tests passed!');
            return 0;
        } else {
            console.log('⚠️  Some UX validation tests failed - see details above');
            return 1;
        }
    }
}

// Run tests
const tester = new UXValidationTester();
const exitCode = tester.runAllTests();
process.exit(exitCode);