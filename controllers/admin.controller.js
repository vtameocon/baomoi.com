
var Theloai = require('../models/theloai.model.js')
var Admin = require('../models/admin.model.js')
var Tinmoi = require('../models/tinmoi.model.js')
var shortid = require('shortid')

module.exports.getIndex = function(req, res) {
	res.render('admin/index');
}

module.exports.getLogin = function(req, res) {
	res.render('admin/login');
}

module.exports.postLogin = async function(req, res) {
	var name = req.body.name;
	var password = req.body.password;
	var admin = await Admin.findOne({ name: name})
	console.log(req.body.name)

	if (!admin) {
		res.render('admin/login', {
			errors: [
				'admin does not exist'
			],
			values: req.body
		});
		return;
	}

	
	if (admin.password == password) {
		res.cookie('adminId', admin._id, {
			signed: true,
		}, {expires: new Date(5000 + Date.now())});
		res.redirect('/trangchu');
		return
	} 
	
	res.render('admin/login', {
		errors: [
			'password incorrect'
		],
		values: req.body
	});

}

module.exports.getLogout = function (req, res) {
	  res.clearCookie("userId", {path: '/'})
	  res.redirect("/trangchu")
}

module.exports.createNews = async function (req, res) {
	var news = new Theloai
	news.thethao.push({
		id: 'asdf',
		title: 'testTitle',
		content: 'testContent'
	})

	news.save();
}

module.exports.postNews = async function(req, res) {
	var	imagePath 
	var	videoPath
	// create date time in this time
	var d = new Date();
	var date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
	var time = d.getHours() + ":" + d.getMinutes();
	// get file of front-end
	var uploads = req.files;
	for (var upload of uploads ) {
		if (upload.mimetype == "video/mp4") {
			videoPath = upload.path.split('/').slice(1).join('/')
		} else {
			imagePath = upload.path.split('/').slice(1).join('/')
		}
	}
	// get value of req.body
	var ID  = "5ed0800351510d27826764b4"
	var title = req.body.title;
	var content = req.body.content;
	var newsId = shortid.generate();
	var hashtag = req.body.hashtag;
	var theloai = req.body.theloai;
	var trangthai = req.body.trangthai;
	var source = req.body.source;
	var firstNews;
	if (req.body.firstNews == "true") {
		firstNews = "true"
	} else {
		firstNews = "false"
	}
	
	var news = await Theloai.findOne({ _id: ID });
	var tableTinmoi = await Tinmoi.find();
	//double linked list

	function DoublyLinkedListNode(title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source) {
		this.id = shortid
		this.title = title;
		this.content = content;
		this.hashtag = hashtag;
		this.image = imagePath;
		this.video = videoPath;
		this.theloai = theloai;
		this.firstNews = firstNews;
		this.trangthai = trangthai;
		this.thoigian = thoigian;
		this.ngaythang = ngaythang;
		this.comment = comment;
		this.source = source;
		this.next = null;
		this.prev = null;
	}

	function DoublyLinkedList() {
		this.head = null;
		this.tail = null;
		this.size = 0;
	}

	DoublyLinkedList.prototype.isEmpty = function() {
		return this.size == 0;
	}

	DoublyLinkedList.prototype.addFirst = function (title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source) {

		if (this.head === null) {
			this.head = new DoublyLinkedListNode(title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source);
			this.tail = this.head;
		} else {
			var temp = new DoublyLinkedListNode(title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source);
			temp.next = this.head;
			this.head.prev = temp;
			this.head = temp;
		}
		this.size++;

	}

	DoublyLinkedList.prototype.addLast = function (title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source) {
		if (this.tail === null) {
			this.tail = new DoublyLinkedListNode(title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source);
			this.head = this.tail;
		} else {
			var temp = new DoublyLinkedListNode(title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source);
			this.tail.next = temp;
			temp.prev = this.tail;
			this.tail = temp;
		}
		this.size++;
	}



	DoublyLinkedList.prototype.addLastTheloai = function (title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source) {
		if (this.tail === null) {
			this.tail = new DoublyLinkedListNode(title, content, shortid, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, comment, source);
			this.head = this.tail;
			// thêm dữ liệu vào đúng table
			switch (this.head.theloai) {
				case "thethao":

					news.thethao.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []
					})
					news.save();
					break;

				case "giaitri":

					news.giaitri.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []

					})
					news.save();
					break;

				case "vanhoa":

					news.vanhoa.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []
					})
					news.save();
					break;

				case "giaoduc":

					news.giaoduc.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []
					})
					news.save();
					break;

				case "kinhte":

					news.kinhte.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []
					})
					news.save();
					break;

				case "xahoi":

					news.xahoi.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []
					})
					news.save();
					break;

				case "thegioi":

					news.thegioi.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []
					})
					news.save();
					break;

				case "phapluat":

					news.phapluat.push({
						id: this.head.id,
						title: this.head.title,
						content: this.head.content,
						hashtag: this.head.hashtag,
						image: this.head.image,
						video:this.head.video,
						theloai: this.head.theloai,
						firstNews: this.head.firstNews,
						trangthai: this.head.trangthai,
						thoigian: this.head.thoigian,
						ngaythang: this.head.ngaythang,
						source: this.head.source,
						comment: []
					})
					news.save();
					break;

				default:
					break;
			}
		} 
		this.size++;
	}

	//kiể tra file nếu là ảnh thì video=null và ngược lai
	var listTheloai = new DoublyLinkedList()
	var listTinmoi = new DoublyLinkedList()
	if (imagePath) {
		// them vao table Theloai
		listTheloai.addLastTheloai(title, content, newsId, hashtag, imagePath, null, theloai, firstNews, trangthai, time, date, "", source)
		// them vao table Tinmoi
		// nếu không có dữ liệu trong db thì tạo mới
		if (!tableTinmoi[0]) {

			tableTinmoi = new Tinmoi({
				id: newsId,
				title: title,
				content: content,
				hashtag: hashtag,
				image: imagePath,
				video: null,
				theloai: theloai,
				firstNews: firstNews,
				trangthai: trangthai,
				thoigian: time,
				ngaythang: date,
				source: source,
				comment: []
			})
			tableTinmoi.save();

		} else {
			// lấy từ db và lưu vào dslk đôi
			for (var i = 0; i < tableTinmoi.length; i ++) {
				var item = tableTinmoi[i]
				listTinmoi.addLast(
					item.title, 
					item.content, 
					item.id, 
					item.hashtag, 
					item.image, 
					item.video, 
					item.theloai, 
					item.firstNews, 
					item.trangthai, 
					item.thoigian, 
					item.ngaythang,
					item.comment,
					item.source
				)
			}
			// delete all document when copied 
			await Tinmoi.deleteMany({});
			// lưu vào dslk xong thì thêm vào đầu dslk đôi,
			listTinmoi.addFirst(
				title, 
				content, 
				newsId, 
				hashtag, 
				imagePath, 
				null, 
				theloai, 
				firstNews, 
				trangthai, 
				time, 
				date,
				[],
				source
			)

			// llưu từ dslk về lại tableTinmoi
			for (var node = listTinmoi.head; node != null; node = node.next) {
					var object = {
						id: node.id,
						title: node.title,
						content: node.content,
						hashtag: node.hashtag,
						image: node.image,
						video: node.video,
						theloai: node.theloai,
						firstNews: node.firstNews,
						trangthai: node.trangthai,
						thoigian: node.thoigian,
						ngaythang: node.ngaythang,
						comment: node.comment,
						source: node.source
					}

					
					tableTinmoi = new Tinmoi(object)
					tableTinmoi.save();
			}
				
		}
		
	}
	if (videoPath) {
		//them vao table Theloai
		listTheloai.addLastTheloai(title, content, shortid, hashtag, null, videoPath, theloai, firstNews, trangthai, time, date, "", source)
		// them vao table Tinmoi
		// nếu không có dữ liệu trong db thì tạo mới
		if (!tableTinmoi[0]) {
			tableTinmoi = new Tinmoi({
				id: newsId,
				title: title,
				content: content,
				hashtag: hashtag,
				image: null,
				video: videoPath,
				theloai: theloai,
				firstNews: firstNews,
				trangthai: trangthai,
				thoigian: time,
				ngaythang: date,
				comment: [],
				source: source
			})
			tableTinmoi.save();
		} else {
			// lấy từ db và lưu vào dslk đôi
			for (var i = 0; i < tableTinmoi.length; i ++) {
				var item = tableTinmoi[i]
				listTinmoi.addLast(
					item.title, 
					item.content, 
					item.id, 
					item.hashtag, 
					item.image, 
					item.video, 
					item.theloai, 
					item.firstNews, 
					item.trangthai, 
					item.thoigian, 
					item.ngaythang,
					item.comment,
					item.source
				)
			}
			await Tinmoi.deleteMany({});

			// lưu xong thì thêm vào đầu dslk đôi,
			listTinmoi.addFirst(
				title, 
				content, 
				newsId, 
				hashtag, 
				null, 
				videoPath, 
				theloai, 
				firstNews, 
				trangthai, 
				time, 
				date,
				[],
				source
			)

			// llưu từ dslk về lại tableTinmoi sau đó save
			for (var node = listTinmoi.head; node != null; node = node.next) {
					var object = {
						id: node.id,
						title: node.title,
						content: node.content,
						hashtag: node.hashtag,
						image: node.image,
						video: node.video,
						theloai: node.theloai,
						firstNews: node.firstNews,
						trangthai: node.trangthai,
						thoigian: node.thoigian,
						ngaythang: node.ngaythang,
						comment: node.comment,
						source: node.source
					}

					tableTinmoi = new Tinmoi(object)
					tableTinmoi.save();
			 }
		}
	}


	res.redirect('/trangchu')

}

module.exports.deleteDemo = async function(req, res) {
	var news = await Theloai.findOne({_id : "5ed0800351510d27826764b4"})

	for (var i = 0; i < news.thethao.length; i ++) {
		if (news.thethao[i].title == "double List")  {
			news.thethao.splice(i, 1);
			news.save();
		}
	}

	res.redirect('/');
}