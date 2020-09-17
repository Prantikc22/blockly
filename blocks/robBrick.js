/**
 * @fileoverview Brick blocks for EV3.
 * @requires Blockly.Blocks
 * @author Beate
 */
'use strict';

goog.provide('Blockly.Blocks.robBrick');

goog.require('Blockly.Blocks');

/**
 * @lends Block
 */

Blockly.Blocks['robBrick_EV3-Brick'] = {
    /**
     * EV3 brick.
     * 
     * @constructs robBrick_EV3_brick
     * @memberof Block
     */

    init : function() {
        this.setColour('#BBBBBB');
        this.setInputsInline(false);
        var wheelDiameter = new Blockly.FieldTextInput('0', Blockly.FieldTextInput.nonnegativeNumberValidator)
        var trackWidth = new Blockly.FieldTextInput('0', Blockly.FieldTextInput.nonnegativeNumberValidator)
        this.appendDummyInput().appendField(new Blockly.FieldLabel(this.workspace.device.toUpperCase(), 'brick_label'));
        this.appendDummyInput().appendField(Blockly.Msg.BRICK_WHEEL_DIAMETER).appendField(wheelDiameter, 'WHEEL_DIAMETER').appendField('cm');
        this.appendDummyInput().appendField(Blockly.Msg.BRICK_TRACK_WIDTH).appendField(trackWidth, 'TRACK_WIDTH').appendField('cm');
        this.setDeletable(false);
    }
};

Blockly.Blocks['robBrick_WeDo-Brick'] = {
    init : function() {
        var name = Blockly.Variables.findLegalName(Blockly.Msg.BRICKNAME_WEDO.charAt(0).toUpperCase(), this);
        this.nameOld = name;
        var nameField = new Blockly.FieldTextInput(name, this.validateName);
        this.setColour('#BBBBBB');
        this.setInputsInline(false);
        this.setDeletable(false);
        this.appendDummyInput().appendField(new Blockly.FieldLabel(this.workspace.device.toUpperCase(), 'brick_label'));
        this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(nameField, 'VAR');
        //this.setDeletable(false);
    },
    validateName : function(name) {
        var block = this.sourceBlock_;
        name = name.replace(/[\s\xa0]+/g, '').replace(/^ | $/g, '');
        // no name set -> invalid
        if (name === '')
            return null;
        if (!name.match(/^[a-zA-Z][a-zA-Z_\-:!§$%@=?\*+~#\.$/0-9]*$/))
            return null;
        // Ensure two identically-named variables don't exist.
        name = Blockly.Variables.findLegalName(name, block);
        Blockly.Variables.renameVariable(block.nameOld, name, this.sourceBlock_.workspace);
        block.nameOld = name;
        return name;
    },
    getVarDecl : function() {
        return [ this.getFieldValue('VAR') ];
    },
    getVars : function() {
        return [ this.getFieldValue('VAR') ];
    },
};

Blockly.Blocks['robBrick_senseBox-Brick'] = {
    /**
     * SenseBox brick.
     * 
     * @constructs robBrick_senseBox-Brick'
     * @memberof Block
     */

    init : function() {
        this.setColour('#BBBBBB');
        this.setInputsInline(false);
        this.appendDummyInput().appendField(new Blockly.FieldLabel('senseBox', 'brick_label'));
        this.appendDummyInput().appendField(Blockly.Msg.BOX_ID).appendField(new Blockly.FieldTextInput("", this.idValidator), 'BOX_ID').setAlign(Blockly.ALIGN_RIGHT);
        this.appendDummyInput('ADD1').appendField(Blockly.Msg.BRICK_PHENOMENON).appendField(new Blockly.FieldTextInput(this.findLegalName_("ID1"),
                this.nameValidator), 'NAME1').appendField(Blockly.Msg.ID).appendField(new Blockly.FieldTextInput("", this.idValidator), 'ID1').setAlign(Blockly.ALIGN_RIGHT);
        this.idCount_ = 1;
        this.setMutatorPlus(new Blockly.MutatorPlus(this));
        this.setTooltip(Blockly.Msg.SENSEBOXBRICK_TOOLTIP);
        this.setDeletable(false);
    },
    getPhenomena : function() {
        var phenomena = [];
        for (var x = 1; x <= this.idCount_; x++) {
            phenomena.push(this.getField('NAME' + x).getValue());
        }
        return phenomena;
    },
    nameValidator : function(name) {
        var block = this.sourceBlock_;
        name = name.replace(/[\s\xa0]+/g, '').replace(/^ | $/g, '');
        // no name set -> invalid
        if (name === '') {
            block.updateSendData_(0);
            return name;
        }
        if (!name.match(/^[a-zA-Z][a-zA-Z_$0-9]*$/))
            return null;
        block.updateSendData_(0);
        return name;
    },
    idValidator : function(id) {
        if (id === '')
            return id;
        if (!id.match(/^[a-fA-F0-9]{24}$/))
            return null;
        return id;
    },
    mutationToDom : function() {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.idCount_);
        return container;
    },
    domToMutation : function(xmlElement) {
        this.idCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        for (var x = 2; x <= this.idCount_; x++) {
            this.appendDummyInput('ADD' + x).appendField(Blockly.Msg.BRICK_PHENOMENON).appendField(new Blockly.FieldTextInput("", this.nameValidator), 'NAME'
                    + x).appendField(Blockly.Msg.ID).appendField(new Blockly.FieldTextInput("", this.idValidator), 'ID' + x).setAlign(Blockly.ALIGN_RIGHT);
        }
        if (this.idCount_ >= 2) {
            this.setMutatorMinus(new Blockly.MutatorMinus(this));
        }
    },
    updateShape_ : function(num) {
        if (num == 1) {
            if (this.idCount_ == 1) {
                this.setMutatorMinus(new Blockly.MutatorMinus(this));
            }
            this.idCount_++;
            this.appendDummyInput('ADD' + this.idCount_).appendField(Blockly.Msg.BRICK_PHENOMENON).appendField(new Blockly.FieldTextInput(
                    this.findLegalName_("ID" + this.idCount_), this.nameValidator), 'NAME' + this.idCount_).appendField(Blockly.Msg.ID).appendField(new Blockly.FieldTextInput(
                    "", this.idValidator), 'ID' + this.idCount_).setAlign(Blockly.ALIGN_RIGHT);
        } else if (num == -1) {
            this.removeInput('ADD' + this.idCount_);
            this.idCount_--;
        }
        if (this.idCount_ == 1) {
            this.mutatorMinus.dispose();
            this.mutatorMinus = null;
        }
        this.render();
        this.updateSendData_(num);
    },
    updateSendData_ : function(num) {
        var container = Blockly.Workspace.getByContainer("blocklyDiv");
        if (container) {
            var blocks = Blockly.Workspace.getByContainer("blocklyDiv").getAllBlocks();
            for (var x = 0; x < blocks.length; x++) {
                var func = blocks[x].setPhenomena;
                if (func) {
                    func.call(blocks[x], num, this.getPhenomena());
                }
            }
        }
    },
    findLegalName_ : function(name) {
        var that = this;
        var isLegalName = function(name) {
            for (var x = 0; x <= that.idCount_; x++) {
                if (that.getField('NAME' + x) && that.getField('NAME' + x).getValue() === name) {
                    return false;
                }
            }
            return true;
        }
        while (!isLegalName(name)) {
            // Collision with another variable.
            var r = name.match(/^(.*?)(\d+)$/);
            if (!r) {
                name += '2';
            } else {
                name = r[1] + (parseInt(r[2], 10) + 1);
            }
        }
        return name;
    },
    onchange : function(what) {
        if (what.name) {
            if (!what.name.startsWith("NAME") || (what.oldValue == what.newValue)) {
                return;
            }
        } else {
            return;
        }
        this.updateSendData_(0);
    }
};

Blockly.Blocks['robBrick_vorwerk-Brick'] = {
    /**
     * vorwerk brick.
     * 
     * @constructs robBrick_vorwerk-Brick
     * @memberof Block
     */

    init : function() {
        this.setColour('#BBBBBB');
        this.setInputsInline(false);
        var ipAddress = new Blockly.FieldTextInput('0.0.0.0')
        var port = new Blockly.FieldTextInput('22', Blockly.FieldTextInput.nonnegativeNumberValidator)
        var username = new Blockly.FieldTextInput('pi')
        var password = new Blockly.FieldTextInput('raspberry')
        this.appendDummyInput().appendField(new Blockly.FieldLabel('Vorwerk', 'brick_label'));
        this.appendDummyInput().appendField(Blockly.Msg.BRICK_IPADDRESS).appendField(ipAddress, 'IP_ADDRESS');
        this.appendDummyInput().appendField(Blockly.Msg.BRICK_PORT).appendField(port, 'PORT');
        this.appendDummyInput().appendField(Blockly.Msg.BRICK_USERNAME).appendField(username, 'USERNAME');
        this.appendDummyInput().appendField(Blockly.Msg.BRICK_PASSWORD).appendField(password, 'PASSWORD');
        this.setTooltip(Blockly.Msg.NAOBRICK_TOOLTIP);
        this.setDeletable(false);
    }
};
