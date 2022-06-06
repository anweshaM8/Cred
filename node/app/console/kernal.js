#!/usr/bin/env node

require('dotenv').config();
require('../helper/functions');
require('../helper/string');

const program = require('commander');

program.version('1.0.0')
program.description('WordPromise App command line interface');
program.boilerplate;


program.parse(process.argv);

program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
});