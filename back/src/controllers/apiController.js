import Api from "../models/API.js";

export const createApi = async (req, res) => {
  try {
    const { name, baseUrl, description } = req.body;

    const api = await Api.create({
      userId: req.user.id,
      name,
      baseUrl,
      description
    });

    res.status(201).json({ message: "API created", api });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyApis = async (req, res) => {
  try {
    const apis = await Api.find({ userId: req.user.id });
    res.json(apis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteApi = async (req, res) => {
  try {
    const api = await Api.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!api) return res.status(404).json({ message: "API not found" });

    res.json({ message: "API deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};