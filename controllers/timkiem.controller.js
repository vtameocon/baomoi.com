var Tinmoi = require('../models/tinmoi.model.js')
var Theloai = require('../models/theloai.model.js')
var Session = require('../models/session.model.js')
var shortid = require('shortid')


module.exports.getSearch = async function (req, res) {
	var query = filterQuery(req.query.q)

	// filter query
	function filterQuery(value) {
	    var str = value;
	    str = str.toLowerCase();
	    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
	    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
	    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
	    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
	    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
	    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
	    str = str.replace(/đ/g,"d");
	    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
	    str = str.replace(/ + /g," ");
	    str = str.trim(); 
	    return str;
	}

	//tìm kiếm theo thể loại
	function DoublyLinkedListNode(data) {
		this.query = data;
		this.next = null;
		this.prev = null;
	}

	function DoublyLinkedList() {
		this.head = null;
		this.tail = null;
		this.size = 0;
		
	}

	// DoublyLinkedList.prototype.isEmpty = function() {
	// 	return this.size == 0;
	// }

	DoublyLinkedList.prototype.addFirst = function (value) {
		if (this.head === null) {
			this.head = new DoublyLinkedListNode(value);
			this.tail = this.head;
		} else {
			var temp = new DoublyLinkedListNode(value);
			temp.next = this.head;
			this.head.prev = temp;
			this.head = temp;
		}
		this.size++;
	}

	DoublyLinkedList.prototype.addLast = function (value) {
		if (this.tail === null) {
			this.tail = new DoublyLinkedListNode(value);
			this.head = this.tail;
		} else {
			var temp = new DoublyLinkedListNode(value);
			this.tail.next = temp;
			temp.prev = this.tail;
			this.tail = temp;
		}
		this.size++;
	}

	var list = new DoublyLinkedList()
	list.addLast(query)

	for (var node = list.head; node != null; node = node.next) {
		switch(node.query) {
			case "xahoi": 
			case "xa hoi":
				res.redirect("/xahoi")
				break;
			case "thethao":
			case "the thao":
				res.redirect("/thethao")
				break;
			case "thegioi":
			case "the gioi":
				res.redirect("/thegioi")
				break;
			case "vanhoa":
			case "van hoa":
				res.redirect("/vanhoa")
				break;
			case "kinhte":
			case "kinh te":
				res.redirect("/kinhte")
				break;
			case "giaoduc":
			case "giao duc":
				res.redirect("/giaoduc")
				break;
			case "giaitri":
			case "giai tri":
				res.redirect("/giaitri")
				break;
			case "phapluat":
			case "phap luat":
				res.redirect("/phapluat")
				break;
			default:

				var tableTinmoi = await Tinmoi.find({})	
				var result = {errors: true}			
				
				if (node.query == "video") {
					// tìm kiếm video
					var video = tableTinmoi.filter(function (obj) {
						return obj.video !== null
					})

					// tìm kiếm theo tiêu đề
					var title = tableTinmoi.filter(function (obj) {
						var filterTitle = filterQuery(obj.title);
						return filterTitle.indexOf(node.query) !== -1;
					})

					if (video[0]){
						result.videos = video
						result.errors = false				
					}
					if (title[0]) {
						result.titles = title
						result.errors = false
					}
					res.render("timkiem/timkiem.pug", result)

				} else {
					var title = tableTinmoi.filter(function (obj) {
						var filterTitle = filterQuery(obj.title);
						return filterTitle.indexOf(node.query) !== -1;
					})

					if (title[0]) {
						result.titles = title
						result.errors = false	
					}
					
					res.render("timkiem/timkiem.pug", result)	
				}

				
		}

	}



}