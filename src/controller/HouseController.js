import Houses from "../models/Houses";
import User from "../models/User";
import * as Yup from "yup";

class HouseController {
  async index(req, res) {
    const { status } = req.query;

    const houses = await Houses.find({ status });

    return res.json(houses);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    const { filename } = req.file;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "falha na validação" });
    }

    const house = await Houses.create({
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
    });

    return res.json(house);
  }

  async update(req, res) {
    const { filename } = req.file;
    const { house_id } = req.params;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers;

    const schema = Yup.object().shape({
      description: Yup.string().required(),
      price: Yup.number().required(),
      location: Yup.string().required(),
      status: Yup.boolean().required(),
    });

    const user = await User.findById(user_id);
    const houseUser = await Houses.findById(house_id);

    if (String(user._id) !== String(houseUser.user)) {
      return res.status(401).json({ error: "Não aoutorizado" });
    }

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "falha na validação" });
    }

    const houses = await Houses.updateOne(
      { _id: house_id },
      {
        user: user_id,
        thumbnail: filename,
        description,
        price,
        location,
        status,
      }
    );
    return res.send();
  }

  async destroy(req, res) {
    const { house_id } = req.body;
    const { user_id } = req.headers;

    const user = await User.findById(user_id);
    const houseUser = await Houses.findById(house_id);

    if (String(user._id) !== String(houseUser.user)) {
      return res.status(401).json({ error: "Não aoutorizado" });
    }

    await Houses.findByIdAndDelete({ _id: house_id });
    return res.json({ message: "excluida com sucesso" });
  }
}

export default new HouseController();
