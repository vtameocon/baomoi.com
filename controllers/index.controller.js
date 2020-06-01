var Tinmoi = require('../models/tinmoi.model.js')
var Theloai = require('../models/theloai.model.js')
var Session = require('../models/session.model.js')
var shortid = require('shortid')

module.exports.getIndex = async function (req, res) {
	var sessionId = req.signedCookies.sessionId
	var adminId = req.signedCookies.adminId
	var tinmoi = await Tinmoi.find({});
	var tinmoiTemp = await Tinmoi.find({});
	var theloai = await Theloai.findOne({_id: "5ed0800351510d27826764b4"})

	// find max length comment.
	var maxComment = tinmoiTemp;   //vì thay đổi giá trị của maxComment củng thay đổi giá trị của giá trị gán với nó 
	var temp;						//nên dùng 1 table tinmoi tạm để tìm maxComment					
    for(var i = 0; i < maxComment.length - 1; i++){
        for(var j = i + 1; j < maxComment.length; j++){
            if(maxComment[i].comment.length < maxComment[j].comment.length){
                // Hoan vi 2 so maxComment[i].comment.length va maxComment[j].comment.length
                temp = maxComment[i]
                maxComment[i] = maxComment[j]
                maxComment[j] = temp   
            }
        }
    }
	maxComment.splice(6)
	res.render('index', {
		tinmois: tinmoi,
		theloais: theloai,
		sessionId: sessionId,
		adminId: adminId,
		maxComments: maxComment
	})
}




module.exports.getNews = async function (req, res) {
	var sessionId = req.signedCookies.sessionId
	var adminId = req.signedCookies.adminId
	var id = req.params.id;
	var news = await Tinmoi.findOne({id: id})
	var theloai = news.theloai
	var tinlienquan = await Tinmoi.find({theloai: theloai})
	var allNews = await Tinmoi.find({})
	var session = await Session.findOne({sessionId: sessionId})
	
	res.render('news', {
		news: news,
		tinlienquan: tinlienquan,
		allNews: allNews,
		adminId: adminId,
		session: session,
	})
}

module.exports.postComment = async function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var comment = req.body.content;
	var rating = req.body.rating
	var sessionId = req.signedCookies.sessionId

	var d = new Date();
	var date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
	var time = d.getHours() + ":" + d.getMinutes();

	var id = req.params.id;
	var idCommenter = shortid.generate()
	var news = await Tinmoi.findOne({id: id})
	var session = await Session.findOne({sessionId: sessionId})

	var theloaihientai = news.theloai;
	var theloai = await Theloai.findOne({_id: "5ed0800351510d27826764b4"})
	var lengthTheloai = theloai[theloaihientai].length;

	// luu vao danh sach lien ket 
	function DoublyLinkedListNode(id, name, email, comment, rating, date, time, idCommenter) {
		this.newsId = id;
		this.idCommenter = idCommenter;
		this.name = name;
		this.email = email;
		this.comment = comment;
		this.rating = rating;
		this.date = date;
		this.time = time;
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

	DoublyLinkedList.prototype.addLast = function (id, name, email, comment, rating, date, time, idCommenter) {
		if (this.tail === null) {
			this.tail = new DoublyLinkedListNode(id, name, email, comment, rating, date, time, idCommenter);
			this.head = this.tail;

			news.comment.push({
				newsId: this.head.newsId,
				idCommenter: this.head.idCommenter,
				name: this.head.name,
				email: this.head.email,
				comment: this.head.comment,
				rating: this.head.rating,
				date: this.head.date,
				time: this.head.time

			})
			session.idCommenter = this.head.idCommenter;
			session.save();
			news.save();

			for (var i = 0; i < lengthTheloai; i ++) {
				if (theloai[theloaihientai][i].id == id) {
					theloai[theloaihientai][i].comment.push({
						newsId: this.head.newsId,
						idCommenter: this.head.idCommenter,
						name: this.head.name,
						email: this.head.email,
						comment: this.head.comment,
						rating: this.head.rating,
						date: this.head.date,
						time: this.head.time
					})
					// using push with the subdocomment, mongoose dont know that this field has changed. so doesn't save
					// using markModified and specified the path you want to save
					theloai.markModified(theloaihientai)
					theloai.save()
					break;
				}
			}
		} 
	}

	var dll = new DoublyLinkedList
	dll.addLast(id, name, email, comment, rating, date, time, idCommenter);

	res.redirect("/trangchu/tin-tuc-hot/" + id);


}


module.exports.postNewComment = async function (req, res) {
	var idNews = req.params.id;
	var newComment = req.body.newComment;
	var newRating = req.body.rating;
	var idCommenter = req.body.idCommenter;

	var news = await Tinmoi.findOne({id: idNews})

	var theloaihientai = news.theloai;
	var theloai = await Theloai.findOne({_id: "5ed0800351510d27826764b4"})
	var lengthTheloai = theloai[theloaihientai].length;

	function DoublyLinkedListNode(newComment, newRating) {
		this.newComment = newComment;
		this.newRating = newRating;
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

	DoublyLinkedList.prototype.addLast = function (newComment, newRating) {
		if (this.tail === null) {
			this.tail = new DoublyLinkedListNode(newComment, newRating);
			this.head = this.tail;

			for (var i = 0; i < news.comment.length; i ++) {
				if (news.comment[i].idCommenter == idCommenter) {
					news.comment[i].comment = this.head.newComment;
					news.comment[i].rating = this.head.newRating;
					news.markModified("comment")
					news.save()
					break;
				}
			}
			


			for (var i = 0; i < lengthTheloai; i ++) {
				if (theloai[theloaihientai][i].id == idNews) {
					for (var j = 0; j < theloai[theloaihientai][i].comment.length; j ++) {
						if (theloai[theloaihientai][i].comment[j].idCommenter == idCommenter) {											
							theloai[theloaihientai][i].comment[j].comment = this.head.newComment
							theloai[theloaihientai][i].comment[j].rating = this.head.newRating
							// using push with the subdocomment, mongoose dont know that this field has changed. so doesn't save
							// using markModified and specified the path you want to save
							theloai.markModified(theloaihientai)
							theloai.save()
							break;

						}
					}
				}
			}
		} 
	}

	var dll = new DoublyLinkedList
	dll.addLast(newComment, newRating);
	res.redirect("/trangchu/tin-tuc-hot/" + idNews);


}


module.exports.deleteComment = async function (req, res) {
	var idNews = req.params.id;
	var idCommenter = req.body.idCommenter;

	var news = await Tinmoi.findOne({id: idNews})

	var theloaihientai = news.theloai;
	var theloai = await Theloai.findOne({_id: "5ed0800351510d27826764b4"})
	var lengthTheloai = theloai[theloaihientai].length;

	function DoublyLinkedListNode(idNews, idCommenter) {
		this.idNews = idNews;
		this.idCommenter = idCommenter;
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

	DoublyLinkedList.prototype.addLast = function (idNews, idCommenter) {
		if (this.tail === null) {
			this.tail = new DoublyLinkedListNode(idNews, idCommenter);
			this.head = this.tail;

			for (var i = 0; i < news.comment.length; i ++) {
				if (news.comment[i].idCommenter == idCommenter) {
					news.comment.splice(i, 1)
					news.markModified("comment")
					news.save()
					break;
				}
			}
			

			for (var i = 0; i < lengthTheloai; i ++) {
				if (theloai[theloaihientai][i].id == idNews) {
					for (var j = 0; j < theloai[theloaihientai][i].comment.length; j ++) {
						if (theloai[theloaihientai][i].comment[j].idCommenter == idCommenter) {											

							theloai[theloaihientai][i].comment.splice(j, 1);  // bo di 1 ptu tai vitri j
							
							// using push with the subdocomment, mongoose dont know that this field has changed. so doesn't save
							// using markModified and specified the path you want to save
							theloai.markModified(theloaihientai)
							theloai.save()
							break;

						}
					}
				}
			}
		} 
	}

	var dll = new DoublyLinkedList
	dll.addLast(idNews, idCommenter);
	res.redirect("/trangchu/tin-tuc-hot/" + idNews);

}


module.exports.updateNews = async function (req, res) {
	// lay du lieu tu front-end
	var idTableTheloai  = "5ed0800351510d27826764b4"
	var idNews = req.params.id
	var title = req.body.title
	var content = req.body.content
	var hashtag = req.body.hashtag
	var theloai = req.body.theloai
	var theloaihientai = req.body.theloaihientai
	var trangthai = req.body.trangthai
	var source = req.body.source
	var thoigianhientai = req.body.thoigianhientai
	var ngaythanghientai = req.body.ngaythanghientai
	var commenthientai = JSON.parse(req.body.commenthientai)
	var chinhsuahientai = JSON.parse(req.body.chinhsuahientai)
	// kiểm tra firstNews có được tích ko
	var firstNews = req.body.firstNews
	if (req.body.firstNews == "on") {
		firstNews = "true"
	} else {
		firstNews = "false"
	}

	// tạo thời gian
	var d = new Date();
	var date = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear();
	var time = d.getHours() + ":" + d.getMinutes();

	// kierm tra file là ảnh hay video
	var	imagePath 
	var	videoPath
	var uploads = req.files;
	for (var upload of uploads ) {
		if (upload.mimetype == "video/mp4") {
			videoPath = upload.path.split('/').slice(1).join('/')
		} else {
			imagePath = upload.path.split('/').slice(1).join('/')
		}
	}
	// tạo danh sách liên kết 
	function DoublyLinkedListNode(title, content, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, source) {
		this.title = title;
		this.content = content;
		this.hashtag = hashtag;
		this.image = imagePath;
		this.video = videoPath;
		this.theloai = theloai;
		this.firstNews = firstNews;
		this.trangthai = trangthai;
		this.chinhsua = "ngày: " + ngaythang + " vào lúc: " + thoigian
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

	DoublyLinkedList.prototype.addFirst = function (title, content, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, source) {

		if (this.head === null) {
			this.head = new DoublyLinkedListNode(title, content, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, source);
			this.tail = this.head;
		} else {
			var temp = new DoublyLinkedListNode(title, content, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, source);
			temp.next = this.head;
			this.head.prev = temp;
			this.head = temp;
		}
		this.size++;

	}

	DoublyLinkedList.prototype.addLast = function (title, content, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, source) {
		if (this.tail === null) {
			this.tail = new DoublyLinkedListNode(title, content, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, source);
			this.head = this.tail;
		} else {
			var temp = new DoublyLinkedListNode(title, content, hashtag, imagePath, videoPath, theloai, firstNews, trangthai, thoigian, ngaythang, source);
			this.tail.next = temp;
			temp.prev = this.tail;
			this.tail = temp;
		}
		this.size++;
	}




	// tạo ra 2 danh sách liên kết
	var listTheloai = new DoublyLinkedList()
	var listTinmoi = new DoublyLinkedList()

	// nếu tồn lại ảnh thì cho video = null và ngược lại
	if (imagePath) {
		// luu vao danh sach lien ket Theloai va dslk Tinmoi
		listTheloai.addLast(title, content, hashtag, imagePath, null, theloai, firstNews, trangthai, time, date, source );
		listTinmoi.addLast(title, content, hashtag, imagePath, null, theloai, firstNews, trangthai, time, date, source );

		// tim kiem trong data base
		var tableTheloai = await Theloai.findOne({ _id: idTableTheloai });
		var tableTinmoi = await Tinmoi.findOne({id: idNews});

		// cập nhật vào database tin moi
		for (var node = listTinmoi.head; node != null; node = node.next) {
			await tableTinmoi.updateOne({
				title: node.title,
				content: node.content,
				hashtag: node.hashtag,
				image: node.image,
				video: node.video,
				theloai: node.theloai,
				firstNews: node.firstNews,
				trangthai: node.trangthai,
				source: node.source
			})
			tableTinmoi.chinhsua.push(node.chinhsua)
			tableTinmoi.save()

			// cập nhật vào tableTheloai 
			// llặp qua thể loại hiện tại
			for (var i = 0; i < tableTheloai[theloaihientai].length; i ++) {
				// nếu thể loại hiện tại không thay đổi thì cập nhật 
				if (theloaihientai === theloai) {
					if (tableTheloai[theloaihientai][i].id === idNews) {
						tableTheloai[theloaihientai][i].title = node.title
						tableTheloai[theloaihientai][i].content = node.content
						tableTheloai[theloaihientai][i].hashtag = node.hashtag
						tableTheloai[theloaihientai][i].image = node.image
						tableTheloai[theloaihientai][i].video = node.video
						tableTheloai[theloaihientai][i].theloai = node.theloai
						tableTheloai[theloaihientai][i].firstNews = node.firstNews
						tableTheloai[theloaihientai][i].trangthai = node.trangthai
						tableTheloai[theloaihientai][i].source = node.source
						
						tableTheloai[theloaihientai][i].chinhsua.push(node.chinhsua)
						tableTheloai.markModified(theloaihientai)
						tableTheloai.save()

					}
				// nếu thay đổi thì tạo thông tin mới bên thể loại mới và xóa thông tin cũ
				} else {
					tableTheloai[theloai].push({
						id: idNews,
						title: node.title,
						content: node.content,
						hashtag: node.hashtag,
						image: node.image,
						video: node.video,
						theloai: node.theloai,
						firstNews: node.firstNews,
						trangthai: node.trangthai,
						thoigian: thoigianhientai,
						ngaythang: ngaythanghientai,
						source: node.source,
						comment: commenthientai,
						chinhsua: chinhsuahientai
					})
					tableTheloai.markModified(theloai)
					var lastIndexOfTheLoai = tableTheloai[theloai].length - 1;
					// tạo thông tin mới
					tableTheloai[theloai][lastIndexOfTheLoai].chinhsua.push(node.chinhsua)
					// xóa thông tin cũ (bỏ đi 1 phần tử từ vị trí i)
					for (var i = 0; i < tableTheloai[theloaihientai].length; i ++) {
						if (tableTheloai[theloaihientai][i].id === idNews) {
							tableTheloai[theloaihientai].splice(i, 1) 
							tableTheloai.save();
							break; 
						}
					}
						
					break;

				}
			}
			
		}





		res.redirect('/'+theloai+'/news/'+idNews)
	}

	if (videoPath) {

	}

}

module.exports.deleteNews = async function (req, res) {
	var idTheloai = "5ed0800351510d27826764b4"
	var theloai = req.body.theloai
	var idNews = req.params.id;
	var objId = req.body.objId;
	var tableTinmoi = await Tinmoi.findOne({_id: objId})
	var tableTheloai = await Theloai.findOne({_id: idTheloai})
	// xóa trong tin mới
	await tableTinmoi.deleteOne()
	// xóa trong thể loại
	for (var i = 0; i < tableTheloai[theloai].length; i ++) {
		if (tableTheloai[theloai][i].id === idNews) {
			tableTheloai[theloai].splice(i, 1)
			tableTheloai.save()
			break;
		}
	}
	res.redirect("/trangchu");
}