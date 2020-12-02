const processRequest = () => {};
let tabNodeValue = '    '; //'\u0009' // with 4 spaces: Array(4).join('\u00a0')

$(function() {
	$('#invalid-request').hide();

	$('#request-data').on('keydown', function(e) {
		if(e.key == 'Tab') {
			e.preventDefault();
			let sel = document.getSelection();
			let range = sel.getRangeAt(0);
			let tabNode = document.createTextNode(tabNodeValue);
			range.insertNode(tabNode);
			range.setStartAfter(tabNode);
			range.setEndAfter(tabNode);
		}
	});

	let initialRequest = {
		name: 'Nitin Pandey',
		age: new Date(new Date() - new Date('2001/10/02 00:00')).getFullYear() - 1970,
		talents: [
			'Pleasing',
			'Coding',
			'Rangoli-making'
		]
	}, initialServer = {
		students: [
			{
				name: 'Param Siddharth',
				age: new Date(new Date() - new Date('2001/08/27 16:10')).getFullYear() - 1970,
				talents: [
					'Programming',
					'Singing'
				]
			},
			{
				name: 'Ritesh Yadav',
				age: new Date(new Date() - new Date('2000/11/03 00:00')).getFullYear() - 1970,
				talents: [
					'Coding',
					'Smiling'
				]
			},
		]
	};

	window.dataState = {
		req: { ...initialRequest },
		ser: { ...initialServer },
		res: {},
		setReq: (o) => {
			window.dataState.req = {
				...(window.dataState.req),
				...o
			};
		},
		setSer: (o) => {
			window.dataState.ser = {
				...(window.dataState.ser),
				...o
			};
		},
		setRes: (o) => {
			window.dataState.res = {
				...(window.dataState.res),
				...o
			};
		},
	};

	$('#request-data').on('DOMCharacterDataModified', function(e) {
		try {
			let obj = JSON.parse($(this).text());
			window.dataState.setReq(obj);

			$('#invalid-request').hide();
		} catch(e) {
			$('#invalid-request').show();
		}
	});

	$('#request-data').on('focusout', function(e) {
		hljs.highlightBlock($(this).get(0));
	});

	$('#request-data').text(JSON.stringify(window.dataState.req, null, tabNodeValue));
	$('#server-data').text(JSON.stringify(window.dataState.ser, null, tabNodeValue));
	$('#response-data').text(JSON.stringify(window.dataState.res, null, tabNodeValue));

	hljs.highlightBlock($('#request-data').get(0));
	hljs.highlightBlock($('#server-data').get(0));
	hljs.highlightBlock($('#response-data').get(0));
});