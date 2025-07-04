const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ilovefootball";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Đã kết nối MongoDB");
    runSeed();
  })
  .catch((err) => {
    console.error("❌ Kết nối MongoDB thất bại:", err);
  });

const Schema = mongoose.Schema;

// === SCHEMA ===
const commentSchema = new Schema(
  {
    rating: { type: Number, min: 1, max: 3, required: true },
    content: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
  },
  { timestamps: true }
);

const memberSchema = new Schema(
  {
    membername: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    YOB: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const teamSchema = new Schema(
  {
    teamName: { type: String },
  },
  { timestamps: true }
);

const playerSchema = new Schema(
  {
    playerName: { type: String, required: true },
    image: { type: String, required: true },
    cost: { type: Number, required: true },
    isCaptain: { type: Boolean, default: false },
    infomation: { type: String, required: true },
    comments: [commentSchema],
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teams",
      required: true,
    },
  },
  { timestamps: true }
);

// === MODEL ===
const Member = mongoose.model("Members", memberSchema);
const Team = mongoose.model("Teams", teamSchema);
const Player = mongoose.model("Players", playerSchema);

// === SEED FUNCTION ===
async function runSeed() {
  try {
    await Member.deleteMany({});
    await Team.deleteMany({});
    await Player.deleteMany({});

    const adminPass = await bcrypt.hash("admin123", 10);
    const memberPass = await bcrypt.hash("member123", 10);

    const admin = await Member.create({
      membername: "hackerlo",
      password: adminPass,
      name: "Hacker Lo",
      YOB: 2000,
      isAdmin: true,
    });

    const member = await Member.create({
      membername: "user123",
      password: memberPass,
      name: "Normal User",
      YOB: 1999,
      isAdmin: false,
    });

    const barca = await Team.create({ teamName: "FC Barcelona" });
    const real = await Team.create({ teamName: "Real Madrid" });

    const barcaPlayers = [
      {
        playerName: "Lionel Messi",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/8/89/Lionel_Messi_20180626.jpg",
        cost: 150000000,
        isCaptain: true,
        infomation: "GOAT - Greatest of All Time",
        team: barca._id,
      },
      {
        playerName: "Xavi Hernandez",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/b/b1/Xavi_Hernandez_2012.jpg",
        cost: 70000000,
        isCaptain: false,
        infomation: "Maestro tuyến giữa",
        team: barca._id,
      },
      {
        playerName: "Andres Iniesta",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/01/Andres_Iniesta_2016.jpg",
        cost: 60000000,
        isCaptain: false,
        infomation: "Tiểu thiên tài",
        team: barca._id,
      },
      {
        playerName: "Ronaldinho",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/5/5f/Ronaldinho_2019.jpg",
        cost: 80000000,
        isCaptain: false,
        infomation: "Ảo thuật gia sân cỏ",
        team: barca._id,
      },
      {
        playerName: "Neymar Jr",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/93/Neymar_2018.jpg",
        cost: 100000000,
        isCaptain: false,
        infomation: "Ngôi sao samba",
        team: barca._id,
      },
      {
        playerName: "Gerard Piqué",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/e/ea/Gerard_Pique_2017.jpg",
        cost: 40000000,
        isCaptain: false,
        infomation: "Trung vệ thép",
        team: barca._id,
      },
      {
        playerName: "Sergio Busquets",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/e/e5/Busquets_WC2022.jpg",
        cost: 50000000,
        isCaptain: false,
        infomation: "Bức tường vô hình",
        team: barca._id,
      },
    ];

    const realPlayers = [
      {
        playerName: "Cristiano Ronaldo",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
        cost: 160000000,
        isCaptain: true,
        infomation: "CR7 - biểu tượng vĩ đại",
        team: real._id,
      },
      {
        playerName: "Luka Modrić",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/8/8c/Luka_Modrić_2018.jpg",
        cost: 75000000,
        isCaptain: false,
        infomation: "Quả bóng vàng 2018",
        team: real._id,
      },
      {
        playerName: "Sergio Ramos",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/f/f1/Sergio_Ramos_2017.jpg",
        cost: 70000000,
        isCaptain: false,
        infomation: "Thủ lĩnh hàng thủ",
        team: real._id,
      },
      {
        playerName: "Karim Benzema",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/5/50/Karim_Benzema_2018.jpg",
        cost: 90000000,
        isCaptain: false,
        infomation: "Chân sút thầm lặng",
        team: real._id,
      },
      {
        playerName: "Toni Kroos",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/e/e4/Toni_Kroos_2018.jpg",
        cost: 68000000,
        isCaptain: false,
        infomation: "Chuyên gia kiểm soát bóng",
        team: real._id,
      },
      {
        playerName: "Casemiro",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/f/f1/Casemiro_2018.jpg",
        cost: 60000000,
        isCaptain: false,
        infomation: "Chiến binh tuyến giữa",
        team: real._id,
      },
      {
        playerName: "Marcelo",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/9/98/Marcelo_2018.jpg",
        cost: 55000000,
        isCaptain: false,
        infomation: "Hậu vệ tấn công đầy nghệ thuật",
        team: real._id,
      },
    ];

    await Player.insertMany([...barcaPlayers, ...realPlayers]);

    console.log("🎉 Dữ liệu seed thành công!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Lỗi khi seed:", err);
    mongoose.disconnect();
  }
}
