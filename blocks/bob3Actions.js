/**
 * @fileoverview Action blocks for Bob3.
 * @requires Blockly.Blocks
 * @author Evgeniya
 */

'use strict';

goog.provide('Blockly.Blocks.bob3Actions');

goog.require('Blockly.Blocks');

Blockly.Blocks['bob3Actions_set_led'] = {
    /**
     * Turn bricklight on.
     *
     * @constructs makeblockActions_leds_on
     * @this.Blockly.Block
     * @param {String/dropdown}
     *            SWITCH_COLOR - Green, Orange or Red
     * @param {Boolean/dropdown}
     *            SWITCH_BLINK - True or False
     * @returns immediately
     * @memberof Block
     */
    init : function() {
        var ledSide = new Blockly.FieldDropdown([ [ 'Left', 'Left' ], [ 'Right', 'Right' ] ]);
        var ledState = new Blockly.FieldDropdown([ [ 'On', 'On' ], [ 'Off', 'Off' ] ]);
        this.setColour(Blockly.CAT_ACTION_RGB);
        this.appendValueInput('COLOR').appendField(Blockly.Msg.LED_ON).appendField(ledSide, 'LEDSIDE').appendField(ledState, 'LEDSTATE');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.LED_ON_TOOLTIP);
    }
};
