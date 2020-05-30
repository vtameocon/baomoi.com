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
