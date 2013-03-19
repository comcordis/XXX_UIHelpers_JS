var XXX_TextInputExample = function (input, example)
{
	this.example = example;
	
	this.elements = {};
	
	this.elements.input = XXX_DOM.get(input);
	this.elements.parent = XXX_DOM.getParent(this.elements.input);
	
	var clearLink = XXX_DOM.createElementNode('a');
	clearLink.href = '#';
	XXX_CSS.setClass(clearLink, 'XXX_TextInputExample_clear');
	XXX_DOM.setInner(clearLink, '<img src="http://' + XXX_URI.staticURIPathPrefix + 'YAT/presenters/images/icons/black/cross.png" class="YAT_icon">');
	
	XXX_DOM.appendChildNode(this.elements.parent, clearLink);
	
	this.elements.clearLink = clearLink;
	
	this.eventDispatcher = new XXX_EventDispatcher();
	
	var XXX_TextInputExample_instance = this;
	
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.clearLink, 'click', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_TextInputExample_instance.clickedClear();
	});
	
	
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.input, 'keyUp', function ()
	{
		XXX_TextInputExample_instance.changeHandler();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.input, 'change', function ()
	{
		XXX_TextInputExample_instance.changeHandler();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.input, 'paste', function ()
	{
		XXX_TextInputExample_instance.changeHandler();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.input, 'cut', function ()
	{
		XXX_TextInputExample_instance.changeHandler();
	});
	
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.input, 'focus', function ()
	{
		XXX_TextInputExample_instance.tryDisablingExample();
		XXX_TextInputExample_instance.updateClearVisibility();
	});
	
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.input, 'blur', function ()
	{
		XXX_TextInputExample_instance.tryEnablingExample();		
		XXX_TextInputExample_instance.updateClearVisibility();
	});
	
	var nativeForm = XXX_DOM_NativeHelpers.nativeCharacterLineInput.getNativeForm(this.elements.input);
	
	XXX_DOM_NativeEventDispatcher.addEventListener(nativeForm, 'submit', function ()
	{
		XXX_TextInputExample_instance.submitHandler();
	});
	
	this.tryEnablingExample();
	this.updateClearVisibility();
};


XXX_TextInputExample.prototype.clickedClear = function ()
{
	XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, '');
	this.hideClear();
	this.tryEnablingExample();
};

XXX_TextInputExample.prototype.hideClear = function ()
{
	XXX_CSS.setStyle(this.elements.clearLink, 'display', 'none');
};

XXX_TextInputExample.prototype.showClear = function ()
{
	XXX_CSS.setStyle(this.elements.clearLink, 'display', 'inline');
};

XXX_TextInputExample.prototype.getValue = function ()
{
	var value = XXX_DOM_NativeHelpers.nativeCharacterLineInput.getValue(this.elements.input);
	
	if (value == this.example)
	{
		value = '';
	}
	
	return value;
};

XXX_TextInputExample.prototype.updateClearVisibility = function ()
{
	var value = this.getValue();
	
	if (value == '')
	{
		this.hideClear();
	}
	else
	{
		this.showClear();
	}
};

XXX_TextInputExample.prototype.tryDisablingExample = function ()
{
	var value = XXX_DOM_NativeHelpers.nativeCharacterLineInput.getValue(this.elements.input);
	
	if (value == this.example)
	{
		XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, '');
		
		XXX_CSS.removeClass(this.elements.input, 'XXX_TextInputExample_example');
	}
};

XXX_TextInputExample.prototype.tryEnablingExample = function ()
{
	var value = XXX_DOM_NativeHelpers.nativeCharacterLineInput.getValue(this.elements.input);
	
	if (value == '')
	{
		XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, this.example);
		
		XXX_CSS.addClass(this.elements.input, 'XXX_TextInputExample_example');
	}
};

XXX_TextInputExample.prototype.changeHandler = function ()
{
	this.tryEnablingExample();
	this.updateClearVisibility();
	
	this.eventDispatcher.dispatchEventToListeners('change', this);
};

XXX_TextInputExample.prototype.submitHandler = function ()
{
	this.tryDisablingExample();
	
	return true;
};