import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";

interface IOnWhatsapp {
  jid: string;
  exists?: boolean;
}

const checker = async (number: string, wbot: any): Promise<IOnWhatsapp | undefined> => {
  try {
    const [validNumber] = await wbot.onWhatsApp(`${number}@s.whatsapp.net`);
    return validNumber;
  } catch (error) {
    console.error("Error checking number on WhatsApp:", error);
    return undefined;
  }
};

const CheckContactNumber = async (
  number: string,
  companyId: number
): Promise<IOnWhatsapp> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(companyId);
  const wbot = getWbot(defaultWhatsapp.id);

  const isNumberExit = await checker(number, wbot);

  if (isNumberExit && !isNumberExit.exists) {
    console.warn(`Number ${number} does not exist on WhatsApp.`);
  }

  return isNumberExit || { jid: `${number}@s.whatsapp.net`, exists: false };
};

export default CheckContactNumber;
