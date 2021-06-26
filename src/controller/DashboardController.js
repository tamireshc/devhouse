import Houses from "../models/Houses";

class DashboardController {
  async show(req, res) {
    const { user_id } = req.headers;

    const houses = await Houses.find({ user: user_id });

    return res.json({ houses });
  }
}

export default new DashboardController();
