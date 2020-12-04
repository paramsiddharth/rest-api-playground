const processRequest = () => {
	validateEndpoint();
	hljs.highlightBlock($('#request-data').get(0));
	hljs.highlightBlock($('#server-data').get(0));
	hljs.highlightBlock($('#response-data').get(0));
};

const tabNodeValue = '    '; //'\u0009' // with 4 spaces: Array(4).join('\u00a0')
const validEndpoints = [
	'students/',
	'students',
	'dishes/',
	'dishes'
];
const defaultEp = 'students';
const STATUS_OK = 'OK', STATUS_FAIL = 'FAIL';

$(function() {
	$('#invalid-request').hide();

	const karnaHeePadegaAbToh = setInterval(refreshRequest, 1000);

	$('#request-data').text(JSON.stringify(window.dataState.req, null, tabNodeValue));
	$('#server-data').text(JSON.stringify(window.dataState.ser, null, tabNodeValue));
	$('#response-data').text(JSON.stringify(window.dataState.res, null, tabNodeValue));

	hljs.highlightBlock($('#request-data').get(0));
	hljs.highlightBlock($('#server-data').get(0));
	hljs.highlightBlock($('#response-data').get(0));

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

	$('#endpoint').on('keyup', function(e) {
		window.dataState.setEp($(this).val());
	});

	$('#request-data').on('DOMCharacterDataModified', refreshRequest);

	$('#request-data').on('focusout', function(e) {
		hljs.highlightBlock($(this).get(0));
	});

	$('[name=reqMethod]').on('click', function() {
		let v = $(this).val();
		window.dataState.setReqMethod(v);
		if (v == 'GET' || v == 'DELETE') {
			$('code.hljs#request-data').css({
				backgroundColor: '#2E2E2E',
				color: '#ABABAB',
				filter: 'grayscale(50%)'
			}).prop('contentEditable', false);
		} else {
			$('code.hljs#request-data').css({
				backgroundColor: '#1E1E1E',
				color: '#DCDCDC',
				filter: 'grayscale(0%)'
			}).prop('contentEditable', true);
		}
	});

	$('[name=reqMethod][value=GET]').trigger('click');
});

let initialRequest = {
	name: 'Nitin Pandey',
	age: new Date(new Date() - new Date('2001/10/02 00:00')).getFullYear() - 1970,
	talents: [
		'Pleasing',
		'Coding',
		'Rangoli-making'
	],
	website: null
}, initialServer = {
	students: [
		{
			id: 0,
			name: 'Param Siddharth',
			age: new Date(new Date() - new Date('2001/08/27 16:10')).getFullYear() - 1970,
			talents: [
				'Programming',
				'Singing'
			],
			website: 'http://www.paramsid.com'
		},
		{
			id: 1,
			name: 'Ritesh Yadav',
			age: new Date(new Date() - new Date('2000/11/03 00:00')).getFullYear() - 1970,
			talents: [
				'Coding',
				'Smiling'
			],
			website: 'https://github.com/DARK-art108'
		},
	],
	dishes: [
		{
			id: 0,
			name: 'Samosa',
			taste: 'Spicy'
		},
		{
			id: 1,
			name: 'Jalebi',
			taste: 'Sweet'
		},
		{
			id: 2,
			name: 'Roti',
			taste: 'Bliss'
		}
	]
};

window.dataState = {
	req: { ...initialRequest },
	ser: { ...initialServer },
	res: { },
	ep: '',
	reqMethod: 'GET',
	setReq: (o) => {
		window.dataState.req = o;
	},
	setSer: (o) => {
		window.dataState.ser = o;
		$('#server-data').text(JSON.stringify(window.dataState.ser, null, tabNodeValue));
	},
	setRes: (o) => {
		window.dataState.res = o;
		$('#response-data').text(JSON.stringify(window.dataState.res, null, tabNodeValue));
	},
	setReqMethod: (v) => {
		window.dataState.reqMethod = v;
	},
	setEp: (v) => {
		window.dataState.ep = v;
	}
};

const refreshRequest = () => {
	try {
		let obj = JSON.parse($('#request-data').text());
		window.dataState.setReq(obj);

		$('#invalid-request').hide();
		$('#sendReq').prop('disabled', false);
	} catch(e) {
		$('#invalid-request').show();
		$('#sendReq').prop('disabled', true);
	}
};

const validateEndpoint = () => {
	let value = window.dataState.ep;
	if (value.length < 1) {
		value = defaultEp;
		window.dataState.setEp(value);
		$('#endpoint').val(value);
	}
	let pathname = URI.parse(value).path;
	for (let ep of validEndpoints) {
		if (ep === pathname) {
			simpleEndpoint();
			return;
		} else if (pathname.startsWith(ep) && pathname.indexOf('/') >= 0 && pathname.indexOf('/') !== pathname.length - 1) {
			let n = pathname.substring(ep.length), id;
			id = Number(n);
			if (Number.isNaN(id)) {
				window.dataState.setRes({
					status: STATUS_FAIL,
					message: `Invalid ID ${n}`
				});
				return;
			}
			
			complexEndpoint(id, ep);
			return;
		}
	}
	window.dataState.setRes({
		status: STATUS_FAIL,
		message: `Invalid endpoint /${window.dataState.ep}`
	});
}

const complexEndpoint = (id, ep) => {
	let newObj, leftOver, oneMore;
	switch (window.dataState.reqMethod) {

		case 'GET':
			switch (ep) {

				case 'students':
				case 'students/':
					newObj = window.dataState.ser.students.filter(s => s.id === id);
					if (newObj.length < 1) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `Student #${id} not found`
						});
						return;
					}
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'Student',
						data: newObj[0]
					});
					return;

				case 'dishes':
				case 'dishes/':
					newObj = window.dataState.ser.dishes.filter(s => s.id === id);
					if (newObj.length < 1) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `Dish #${id} not found`
						});
						return;
					}
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'Dish',
						data: newObj[0]
					});

			}
		return;

		case 'POST':
			window.dataState.setRes({
				status: STATUS_FAIL,
				message: `${window.dataState.reqMethod} not supported on /${window.dataState.ep}`
			});
			return;

		case 'PUT':
			switch (ep) {
				
				case 'students':
				case 'students/':
					if (window.dataState.req.hasOwnProperty('id')) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `${window.dataState.reqMethod} request body may not carry ID`
						});
						return;
					}
					newObj = window.dataState.ser.students;
					leftOver = newObj.filter(s => s.id === id);
					if (leftOver.length < 1) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `Student #${id} not found`
						});
						return;
					}
					for (let i = 0; i < newObj.length; i++) {
						if (newObj[i].id === id) {
							oneMore = {
								...newObj[i],
								...(window.dataState.req)
							};
							window.dataState.ser.students.splice(i, 1);
							leftOver = [
								...(window.dataState.ser.students),
								oneMore
							];
							newObj = window.dataState.ser;
							newObj.students = leftOver;
							window.dataState.setSer(newObj);
							oneMore = window.dataState.ser.students.filter(s => s.id === id)[0];
							window.dataState.setRes({
								status: STATUS_OK,
								message: `Student updated`,
								data: oneMore
							});
							return;
						}
					}
					return;
				
				case 'dishes':
				case 'dishes/':
					if (window.dataState.req.hasOwnProperty('id')) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `${window.dataState.reqMethod} request body may not carry ID`
						});
						return;
					}
					newObj = window.dataState.ser.dishes;
					leftOver = newObj.filter(s => s.id === id);
					if (leftOver.length < 1) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `Dish #${id} not found`
						});
						return;
					}
					for (let i = 0; i < newObj.length; i++) {
						if (newObj[i].id === id) {
							oneMore = {
								...newObj[i],
								...(window.dataState.req)
							};
							window.dataState.ser.dishes.splice(i, 1);
							leftOver = [
								...(window.dataState.ser.dishes),
								oneMore
							];
							newObj = window.dataState.ser;
							newObj.dishes = leftOver;
							window.dataState.setSer(newObj);
							oneMore = window.dataState.ser.dishes.filter(s => s.id === id)[0];
							window.dataState.setRes({
								status: STATUS_OK,
								message: `Dish updated`,
								data: oneMore
							});
							return;
						}
					}

			}
			return;
		
		case 'DELETE':

			switch (ep) {

				case 'students':
				case 'students/':
					newObj = window.dataState.ser.students;
					leftOver = newObj.filter(s => s.id === id);
					if (leftOver.length < 1) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `Student #${id} not found`
						});
						return;
					}
					for (let i = 0; i < newObj.length; i++) {
						if (newObj[i].id === id) {
							oneMore = newObj[i];
							window.dataState.ser.students.splice(i, 1);
							window.dataState.setSer(window.dataState.ser);
							leftOver = window.dataState.ser.students.filter(s => s.id === id).length;
							if (leftOver === 0) {
								window.dataState.setRes({
									status: STATUS_OK,
									message: `Student deleted`,
									data: oneMore
								});
							}
							return;
						}
					}
					return;
				
				case 'dishes':
				case 'dishes/':
					newObj = window.dataState.ser.dishes;
					leftOver = newObj.filter(s => s.id === id);
					if (leftOver.length < 1) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `Dish #${id} not found`
						});
						return;
					}
					for (let i = 0; i < newObj.length; i++) {
						if (newObj[i].id === id) {
							oneMore = newObj[i];
							window.dataState.ser.dishes.splice(i, 1);
							window.dataState.setSer(window.dataState.ser);
							leftOver = window.dataState.ser.dishes.filter(s => s.id === id).length;
							if (leftOver === 0) {
								window.dataState.setRes({
									status: STATUS_OK,
									message: `Dish deleted`,
									data: oneMore
								});
							}
							return;
						}
					}
				
			}
	}
};

const simpleEndpoint = () => {
	let newObj, leftOver, idNew;
	switch (window.dataState.reqMethod) {

		case 'GET':
			switch (window.dataState.ep) {

				case 'students':
				case 'students/':
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'A list of students',
						data: window.dataState.ser.students
					});
					return;

				case 'dishes':
				case 'dishes/':
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'A list of dishes',
						data: window.dataState.ser.dishes
					});

			}
		return;

		case 'POST':
			switch (window.dataState.ep) {

				case 'students':
				case 'students/':
					if (window.dataState.req.hasOwnProperty('id')) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `${window.dataState.reqMethod} request body may not carry ID`
						});
						return;
					}
					idNew = Math.max(...window.dataState.ser.students.map(s => s.id)) + 1;
					leftOver = {
						id: idNew,
						...(window.dataState.req)
					};
					newObj = window.dataState.ser;
					newObj.students = [
						...(newObj.students),
						leftOver
					];
					window.dataState.setSer(newObj);
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'Student added',
						data: window.dataState.ser.students.filter(s => s.id === idNew)[0]
					});
					return;

				case 'dishes':
				case 'dishes/':
					if (window.dataState.req.hasOwnProperty('id')) {
						window.dataState.setRes({
							status: STATUS_FAIL,
							message: `${window.dataState.reqMethod} request body may not carry ID`
						});
						return;
					}
					idNew = Math.max(...window.dataState.ser.dishes.map(s => s.id)) + 1;
					leftOver = {
						id: idNew,
						...(window.dataState.req)
					};
					newObj = window.dataState.ser;
					newObj.dishes = [
						...(newObj.dishes),
						leftOver
					];
					window.dataState.setSer(newObj);
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'Dish added',
						data: window.dataState.ser.dishes.filter(s => s.id === idNew)[0]
					});
			}
			return;

		case 'PUT':
			window.dataState.setRes({
				status: STATUS_FAIL,
				message: `${window.dataState.reqMethod} not supported on /${window.dataState.ep}`
			});
			return;
		
		case 'DELETE':

			switch (window.dataState.ep) {

				case 'students':
				case 'students/':
					newObj = window.dataState.ser;
					leftOver = newObj.students;
					newObj.students = [];
					window.dataState.setSer(newObj);
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'All students deleted',
						data: leftOver
					});
					return;
				
				case 'dishes':
				case 'dishes/':
					newObj = window.dataState.ser;
					leftOver = newObj.dishes;
					newObj.dishes = [];
					window.dataState.setSer(newObj);
					window.dataState.setRes({
						status: STATUS_OK,
						message: 'All dishes deleted',
						data: leftOver
					});
					return;
				
			}
	}
};