
var XXX_NumberInput = function (input, preset, presetSettings)
{
	this.minimum = 0;
	this.maxmimum = 100;
	this.step = 1;
	
	this.type = 'integer';
	
	this.incrementSpeed = 220;
	
	this.decimals = 0;
	
	this.elements = {};
	
	this.elements.input = XXX_DOM.get(input);
	this.elements.parent = XXX_DOM.getParent(this.elements.input);
	
	this.eventDispatcher = new XXX_EventDispatcher();
	
	this.usePreset(preset, presetSettings);
	
	
	var maximumCharacterLength = XXX_String.getCharacterLength(XXX_Type.makeString(this.maximum));
	if (this.type == 'float')
	{
		maximumCharacterLength += 1;
		maximumCharacterLength += this.decimals;
	}
	maximumCharacterLength *= 1;
	maximumCharacterLength = XXX_Number.ceil(maximumCharacterLength);
		
	XXX_CSS.setStyle(this.elements.input, 'text-align', 'right');
	XXX_CSS.setStyle(this.elements.input, 'font-weight', 'bold');
	XXX_DOM_NativeHelpers.nativeCharacterLineInput.setLineCharacterLength(this.elements.input, maximumCharacterLength);
	
	
	
	var XXX_NumberInput_instance = this;
		
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.input, 'blur', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.blurHandler();
	});
	
	this.correctValue();
};

XXX_NumberInput.prototype.setLimits = function (minimum, maximum)
{
	this.minimum = XXX_Default.toPositiveInteger(minimum, 0);
	this.maximum = XXX_Default.toPositiveInteger(maximum, 100);
	
	this.correctValue();
};

XXX_NumberInput.prototype.addPrefix = function (prefix)
{
	if (XXX_Type.isValue(prefix))
	{
		var tempSpan = XXX_DOM.createElementNode('span');
		XXX_DOM.setInner(tempSpan, prefix);
			
		XXX_DOM.appendChildNode(this.elements.parent, tempSpan);
		XXX_DOM.moveBeforeNode(tempSpan, this.elements.input);
	}
};

XXX_NumberInput.prototype.addSuffix = function (suffix)
{
	if (XXX_Type.isValue(suffix))
	{
		var tempSpan = XXX_DOM.createElementNode('span');
		XXX_DOM.setInner(tempSpan, suffix);
			
		XXX_DOM.appendChildNode(this.elements.parent, tempSpan);
		XXX_DOM.moveAfterNode(tempSpan, this.elements.input);
	}
};

XXX_NumberInput.prototype.addCurrencyWrap = function (currency_code)
{
	if (currency_code)
	{
		this.currency_code = currency_code;
		
		if (this.currency_code)
		{
			var currencyInformation = XXX_I18n_Currency.getInformation(this.currency_code);
			
			if (currencyInformation)
			{
				this.addPrefix(currencyInformation.symbol.html);
				this.addSuffix(currencyInformation.code);
			}
		}
	}
};

XXX_NumberInput.prototype.usePreset = function (preset, settings)
{
	switch (preset)
	{
		case 'percentage':
			this.addSuffix('%');
			this.addPlusMinus();
			
			this.type = 'float';
			
			this.minimum = 0;
			this.maximum = 100;
			this.step = 0.01;
			this.decimals = 2;
			
			this.correctValue();
			break;
		case 'roundedPercentage':
			this.addSuffix('%');
			this.addPlusMinus();
			
			this.type = 'integer';
			
			this.minimum = 0;
			this.maximum = 100;
			this.step = 1;
			this.decimals = 0;
			
			this.correctValue();
			break;
		case 'percentageMore':
			this.addSuffix('%');
			this.addPlusMinus();
			
			this.type = 'float';
			
			this.minimum = 0;
			this.maximum = 500;
			this.step = 0.01;
			this.decimals = 2;
			
			this.correctValue();
			break;
		case 'positiveInteger':
			this.minimum = XXX_Default.toPositiveInteger(settings.minimum, 0);
			this.maximum = XXX_Default.toPositiveInteger(settings.maximum, 100);
						
			this.type = 'integer';
			
			this.step = 1;
			this.decimals = 0;
			
			this.addPlusMinus();
			this.correctValue();
			break;
		case 'positiveFloat':
			this.minimum = XXX_Default.toPositiveInteger(settings.minimum, 0);
			this.maximum = XXX_Default.toPositiveInteger(settings.maximum, 100);
			this.step = XXX_Default.toPositiveFloat(settings.step, 0.01);
						
			this.type = 'float';
			
			this.decimals = 2;
			
			this.addPlusMinus();
			this.correctValue();
			break;
		case 'currency':
			this.currency_code = settings.currency_code;
			
			var currencyInformation = XXX_I18n_Currency.getInformation(this.currency_code);			
			var currencyExchangeRate = XXX_I18n_Currency.getExchangeRate(this.currency_code);
			
			this.minimum = 0;
			this.maximum = XXX_Default.toPositiveInteger(10000 * currencyExchangeRate, 1);
			
			this.type = 'float';
			
			this.step = currencyInformation.number.smallestCoin;
			this.decimals = currencyInformation.number.decimals;
			
			if (settings.currency_code)
			{
				this.currency_code = settings.currency_code;
				
				if (this.currency_code)
				{
					this.addPrefix(currencyInformation.symbol.html);
					this.addSuffix(currencyInformation.code);
				}
			}
			
			this.addPlusMinus();
			this.correctValue();
			break;
	}
};

XXX_NumberInput.prototype.addPlusMinus = function ()
{
	var space = XXX_DOM.createElementNode('span');
	XXX_DOM.setInner(space, '&nbsp;');
	
	XXX_DOM.appendChildNode(this.elements.parent, space);
	
	var addLink = XXX_DOM.createElementNode('a');
	addLink.href = '#';
	XXX_DOM.setInner(addLink, '<img src="http://' + XXX_URI.staticURIPathPrefix + 'YAT/presenters/images/icons/blue/plus.png" class="YAT_icon_option">');
	
	XXX_DOM.appendChildNode(this.elements.parent, addLink);
	
	
	this.elements.addLink = addLink;
	
	var substractLink = XXX_DOM.createElementNode('a');
	substractLink.href = '#';
	XXX_DOM.setInner(substractLink, '<img src="http://' + XXX_URI.staticURIPathPrefix + 'YAT/presenters/images/icons/blue/minus.png" class="YAT_icon_option">');
	
	XXX_DOM.appendChildNode(this.elements.parent, substractLink);
	
	this.elements.substractLink = substractLink;
	
	//XXX_DOM.moveBeforeNode(substractLink, this.elements.input);
	
	var XXX_NumberInput_instance = this;
	
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'click', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'mouseDown', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.startIncrementing();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'mouseUp', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.stopIncrementing();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'mouseOut', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.stopIncrementing();
	});
	
	if (XXX_HTTP_Browser.pointerInterface == 'touch')
	{
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'touchStart', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			
			XXX_NumberInput_instance.startIncrementing();
		});
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'touchMove', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
		});
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'touchEnd', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			
			XXX_NumberInput_instance.stopIncrementing();
		});
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.addLink, 'touchCancel', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			
			XXX_NumberInput_instance.stopIncrementing();
		});
	}
	
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'click', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'mouseDown', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.startDecrementing();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'mouseUp', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.stopDecrementing();
	});
	XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'mouseOut', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.stopDecrementing();
	});
	
	if (XXX_HTTP_Browser.pointerInterface == 'touch')
	{
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'touchStart', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			
			XXX_NumberInput_instance.startDecrementing();
		});
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'touchMove', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
		});
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'touchEnd', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			
			XXX_NumberInput_instance.stopDecrementing();
		});
		XXX_DOM_NativeEventDispatcher.addEventListener(this.elements.substractLink, 'touchCancel', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			
			XXX_NumberInput_instance.stopDecrementing();
		});
	}
	
	XXX_DOM_NativeEventDispatcher.addEventListener(XXX_DOM.getBody(), 'mouseUp', function (nativeEvent)
	{
		nativeEvent.preventDefault();
		nativeEvent.stopPropagation();
		
		XXX_NumberInput_instance.stopIncrementing();
		XXX_NumberInput_instance.stopDecrementing();
	});
	
	if (XXX_HTTP_Browser.pointerInterface == 'touch')
	{
		XXX_DOM_NativeEventDispatcher.addEventListener(XXX_DOM.getBody(), 'touchEnd', function (nativeEvent)
		{
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
			
			XXX_NumberInput_instance.stopIncrementing();
			XXX_NumberInput_instance.stopDecrementing();
		});
	}
};

XXX_NumberInput.prototype.startIncrementing = function ()
{
	this.stopIncrementing();
	
	this.incrementingStart = XXX_TimestampHelpers.getCurrentTimestamp();
	
	var XXX_NumberInput_instance = this;
	
	this.incrementInterval = XXX_Timer.startInterval(this.incrementSpeed, function ()
	{
		XXX_NumberInput_instance.incrementIntervalCallback();
	});
	
	this.increment();
};

XXX_NumberInput.prototype.incrementIntervalCallback = function ()
{
	var runningTime = XXX_TimestampHelpers.getCurrentTimestamp() - this.incrementingStart;
	
	if (runningTime == 0)
	{
		runningTime = 1;
	}
	
	var repeat = XXX_Number.power(2, runningTime);
	
	repeat = XXX_Number.lowest(repeat, 16);
	
	for (var i = 0, iEnd = repeat; i < iEnd; ++i)
	{
		this.increment();
	}
};

XXX_NumberInput.prototype.stopIncrementing = function ()
{
	XXX_Timer.stopInterval(this.incrementInterval);
};

XXX_NumberInput.prototype.startDecrementing = function ()
{
	this.stopDecrementing();
	
	this.decrementingStart = XXX_TimestampHelpers.getCurrentTimestamp();
	
	var XXX_NumberInput_instance = this;
	
	this.decrementInterval = XXX_Timer.startInterval(this.incrementSpeed, function ()
	{
		XXX_NumberInput_instance.decrementIntervalCallback();
	});
	
	this.decrement();
};

XXX_NumberInput.prototype.decrementIntervalCallback = function ()
{
	var runningTime = XXX_TimestampHelpers.getCurrentTimestamp() - this.decrementingStart;
	
	if (runningTime == 0)
	{
		runningTime = 1; 
	}
	
	var repeat = XXX_Number.power(2, runningTime);
		
	repeat = XXX_Number.lowest(repeat, 16);
	
	for (var i = 0, iEnd = repeat; i < iEnd; ++i)
	{
		this.decrement();
	}
};

XXX_NumberInput.prototype.stopDecrementing = function ()
{
	XXX_Timer.stopInterval(this.decrementInterval);
};

XXX_NumberInput.prototype.getValue = function ()
{
	var value = false;
	
	if (this.elements.input)
	{
		value = XXX_DOM_NativeHelpers.nativeCharacterLineInput.getValue(this.elements.input);
		switch (this.type)
		{
			case 'integer':
				value = XXX_Type.makeInteger(value);
				break;
			case 'float':
				value = XXX_Type.makeFloat(value);
				
				value = XXX_Number.round(value, this.decimals);
				break;
		}
	}
	
	return value;
};

XXX_NumberInput.prototype.setValue = function (value)
{
	value = this.formatValue(value);
	
	XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, value);	
};

XXX_NumberInput.prototype.formatValue = function (value)
{
	return XXX_I18n_Formatter.formatNumber2(value, this.minimum, this.maximum, this.step, this.decimals);
};

XXX_NumberInput.prototype.blurHandler = function ()
{
	var value = this.getValue();
	
	value = this.formatValue(value);
	
	XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, value);	
	
	this.eventDispatcher.dispatchEventToListeners('change', this);
};

XXX_NumberInput.prototype.correctValue = function ()
{
	var value = this.getValue();
	
	if (value !== false)
	{
		value = this.formatValue(value);
		
		XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, value);
	}
};

XXX_NumberInput.prototype.clickedAdd = function ()
{
	this.increment();
};

XXX_NumberInput.prototype.increment = function ()
{
	var value = this.getValue();
	
	if (value !== false)
	{
		value += this.step;
		
		value = this.formatValue(value);
		
		XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, value);
		
		this.eventDispatcher.dispatchEventToListeners('change', this);
	}
};

XXX_NumberInput.prototype.clickedSubstract = function ()
{
	this.decrement();
};

XXX_NumberInput.prototype.decrement = function ()
{
	var value = this.getValue();
	
	if (value !== false)
	{
		value -= this.step;
		
		value = this.formatValue(value);
		
		XXX_DOM_NativeHelpers.nativeCharacterLineInput.setValue(this.elements.input, value);
		
		this.eventDispatcher.dispatchEventToListeners('change', this);
	}
};
