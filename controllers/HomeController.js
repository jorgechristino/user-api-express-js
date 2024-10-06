class HomeController {
  async index(req, res) {
    res.send("Users API-REST!");
  }
}

module.exports = new HomeController();
