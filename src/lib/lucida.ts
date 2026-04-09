import Lucida from "lucida";
import Qobuz from "lucida/streamers/qobuz/main.js";

export const lucida = new Lucida({
  modules: {
    qobuz: new Qobuz({
      appId: process.env.QOBUZ_APP_ID!,
      appSecret: process.env.QOBUZ_APP_SECRET!,
      token: process.env.QOBUZ_TOKEN!
    })
  }
});
