//when page loads, automatically go to competition mode
switchDisplayMode("comp");

let populated = false;

const widgetHtml = `
<button id="textBtn" class="button" data-type="text">Set widget type to text?</button>
<button id="inputBtn" class="button" data-type="input">Set widget type to input?</button>
<button id="buttonBtn" class="button" data-type="button">Set widget type to button?</button>
`

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
	document.getElementById("myDropdown").classList.toggle("show");

	if(!populated)
	{
		populateSelectionDropdown();
	}

	populated = true;
  }
  
  /// @TODO: Filter function runs on mouse over and will filter out entries that are already out on the dashboard

  function filterFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("myInput");
	filter = input.value.toUpperCase();
	div = document.getElementById("myDropdown");
	a = div.getElementsByTagName("button");
	for (i = 0; i < a.length; i++) {
	  txtValue = a[i].textContent || a[i].innerText;
	  if (txtValue.toUpperCase().indexOf(filter) > -1) {
		a[i].style.display = "";
	  } else {
		a[i].style.display = "none";
	  }
	}
}


function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

	//The reason for takinga substring is to remove -Content from the id to get the "header" child div
	document.getElementById(elmnt.id.substring(0,elmnt.id.length-8)).onmousedown = dragMouseDown;

	function dragMouseDown(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // get the mouse cursor position at startup:
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  document.onmouseup = closeDragElement;
	  // call a function whenever the cursor moves:
	  document.onmousemove = elementDrag;
	}
  
	function elementDrag(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // calculate the new cursor position:
	  pos1 = pos3 - e.clientX;
	  pos2 = pos4 - e.clientY;
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  // set the element's new position:
	  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}
  
	function closeDragElement() {
	  // stop moving when mouse button is released:
	  document.onmouseup = null;
	  document.onmousemove = null;
	}
}

function showWidgetMenu(mouseEvent)
{
	const node = document.createElement("div");
	node.style.top = mouseY(mouseEvent) + "px";
	node.style.left = mouseX(mouseEvent) + "px"
	node.style.justifyContent = "center";
	node.id= "contextMenu";
	node.className = "draggablecontent";

	const removeButtonNode = document.createElement("button");
	removeButtonNode.id = "removeBtn";
	removeButtonNode.className = "button";
	removeButtonNode.textContent = "Remove entry?";
	removeButtonNode.onclick = removeButton.bind(this, mouseEvent);

	node.appendChild(removeButtonNode);

	node.insertAdjacentHTML("beforeend", widgetHtml);

	for(let i = 0; i < node.children.length; i++)
	{
		if(node.children[i].hasAttribute("data-type"))
		{
			node.children[i].addEventListener("click", setWidgetType.bind(this, node.children[i].getAttribute("data-type"), mouseEvent));
		}
	}

	document.body.appendChild(node);

	function mouseX(evt) {
		if (evt.pageX) {
		  return evt.pageX;
		} else if (evt.clientX) {
		  return evt.clientX + (document.documentElement.scrollLeft ?
			document.documentElement.scrollLeft :
			document.body.scrollLeft);
		} else {
		  return null;
		}
	  }
	  
	  function mouseY(evt) {
		if (evt.pageY) {
		  return evt.pageY;
		} else if (evt.clientY) {
		  return evt.clientY + (document.documentElement.scrollTop ?
			document.documentElement.scrollTop :
			document.body.scrollTop);
		} else {
		  return null;
		}
	  }
}

function removeButton(e)
{
	if(e.target.id.substring(e.target.id.length-8, e.target.id.length) === "-Content")
	{
		e.target.remove();
	}
	else
	{
		document.getElementById(e.target.id + "-Content").remove();
	}
}

function setWidgetType(type, e)
{
	var widgetType = type;
	if(e.target.id.substring(e.target.id.length-8, e.target.id.length) === "-Content")
	{
		e.target.dataset.widgetType = widgetType;
	}
	else
	{
		document.getElementById(e.target.id + "-Content").dataset.widgetType = widgetType;
	}
	removeButton(e);
}

/// @TODO: make sure this can work with all widget types once that feature is added
function updateDashboard(key, value)
{
	if(document.getElementById(key + "-Content"))
	{
		switch (document.getElementById(key + "-Content").dataset.widgetType)
		{
			case "text":
				document.getElementById(key + "-Text").textContent = value;
				break;
			case "button":
				document.getElementById(key + "-Button").textContent = value;
				break;
			case "input":
				document.getElementById(key + "-Input").value = value;
		}
	}
}
//Function to switch between debug and comp mode
function switchDisplayMode(mode)
{
    if (mode === "comp")
    {
        document.getElementById("nt").style.display = "none";
		populateDefaults();
    }
    else if (mode === "debug")
    {
        document.getElementById("nt").style.display = "block";
    }
}

//Function to populate network table dropdown to add fields onto page
function populateSelectionDropdown()
{
	const dropDown = document.getElementById('myDropdown');

	fields = document.getElementsByTagName('td');

	const count = fields.length;
	for (let i = 0; i < count; i++)
	{
		if(!fields[i].hasAttribute('id'))
		{
			const node = document.createElement("button");
			const textnode = document.createTextNode(fields[i].textContent);
			node.appendChild(textnode);
			node.onclick = addToDashboard.bind(this, fields[i].textContent);
			dropDown.appendChild(node);
			
		}
	}
}

function saveCurrentLayout()
{
	const currentWidgets = document.getElementsByClassName("draggableheader");
	for(let cW of currentWidgets)
	{
		//check if we have already declared this entry in localStorage
		//if statement checks if its a "new" entry being added
		//otherwise, we can use the id of the div as the "prefix" to the web storage key
		
		//Webstore standard only supports string
		localStorage.setItem(cW.id+"::ShowDefault", "true");
		localStorage.setItem(cW.id+"::XPos", cW.style.left);
		localStorage.setItem(cW.id+"::YPos", cW.style.top);
		localStorage.setItem(cW.id+"::WidgetType", cW.dataset.widgetType);
	}
}

function populateDefaults()
{
	for(let i = 0; i < localStorage.length; i++)
	{
		var currentKey = localStorage.key(i);
		if(currentKey.includes("::ShowDefault"))
		{
			var header = currentKey.substring(0, currentKey.length-13);
			addToDashboard(header);
		}
	}
}

function addToDashboard(header)
{
	if(!document.getElementById(header))
	{
		//Create div with top and left being the x and y pos, get network table key
		const node = document.createElement("div");
		const textnode = document.createTextNode(header);
		node.className = "draggableheader";
		node.id = header;
		node.appendChild(textnode);

		var contentChild;
		var entryType = "text";

		//If widget to be added is saved, use localStorage value for widget type
		if(localStorage.getItem(header+"::ShowDefault"))
		{
			switch(localStorage.getItem(header+"::WidgetType"))
			{
				
				case "button":
					contentChild = document.createElement("button");
					contentChild.textContent = NetworkTables.getValue(header, "Default Value");
					contentChild.id = header+"-Button";
					entryType = "button";
					break;
				case "input":
					contentChild = document.createElement("input");
					contentChild.type = "text";
					contentChild.id = header+"-Input";
					entryType = "input";
					contentChild.addEventListener("keydown", (e) => {
						if (e.key === "Enter"){
							setEntryValue(e.target.value, header);
						}
					});
				case "text":
					contentChild = document.createElement("p");
					contentChild.textContent = NetworkTables.getValue(header, "Default Value");
					contentChild.id = header+"-Text";
					entryType = "text";
				default:
					contentChild = document.createTextNode(NetworkTables.getValue(header, "Default Value"));
					break;
			}
		}
		else //Widget is not saved, so default to text type
		{
			contentChild = document.createElement("p");
			contentChild.textContent = NetworkTables.getValue(header, "Default Value");
			contentChild.id = header+"-Text";
			entryType = "text";
		}

		const contentNode = document.createElement("div");
		contentNode.className = "draggablecontent";
		contentNode.id = header + "-Content";
		contentNode.dataset.widgetType = localStorage.getItem(header+"::WidgetType") ? localStorage.getItem(header+"::WidgetType") : entryType; //If saved, set value to saved value, else use entryType
		contentNode.style.top = localStorage.getItem(header+"::YPos");
		contentNode.style.left = localStorage.getItem(header+"::XPos");

		contentNode.appendChild(node);

		if(contentChild !== undefined)
		{
			contentNode.appendChild(contentChild);
		}
		
		document.body.appendChild(contentNode);

		//Make widget draggable
		dragElement(contentNode);

		//Add support for context menu
		contentNode.addEventListener('contextmenu', function(e) {
      		e.preventDefault();
			showWidgetMenu(e);
		}, false);
	}
}

function setEntryValue(targetVal, header)
{
	NetworkTables.putValue(header, targetVal);
}

/// Everything below is from py network tables

// sets a function that will be called when the websocket connects/disconnects
NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
	
// sets a function that will be called when the robot connects/disconnects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);

// sets a function that will be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

function onRobotConnection(connected) {
	$('#robotstate').text(connected ? "Connected!" : "Disconnected");
	$('#robotAddress').text(connected ? NetworkTables.getRobotAddress() : "disconnected");
}

function onNetworkTablesConnection(connected) {

	if (connected) {
		$("#connectstate").text("Connected!");
		
		// clear the table
		$("#nt tbody > tr").remove();
		
	} else {
		$("#connectstate").text("Disconnected!");
	}
}
//everything above is from pynetworktables2js example js

function onValueChanged(key, value, isNew) {

	// key thing here: we're using the various NetworkTable keys as
	// the id of the elements that we're appending, for simplicity. However,
	// the key names aren't always valid HTML identifiers, so we use
	// the NetworkTables.keyToId() function to convert them appropriately

	if (isNew) {
		var tr = $('<tr></tr>').appendTo($('#nt > tbody:last'));
		$('<td></td>').text(key).appendTo(tr);
		$('<td></td>').attr('id', NetworkTables.keyToId(key))
					   .text(value)
					   .appendTo(tr);
	} else {
	
		// similarly, use keySelector to convert the key to a valid jQuery
		// selector. This should work for class names also, not just for ids
		$('#' + NetworkTables.keySelector(key)).text(value);
	}

	updateDashboard(key, value);
}