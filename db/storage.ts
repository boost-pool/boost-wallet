import { Storage, Drivers } from '@ionic/storage';
import { maxId } from '../utils';

let storage:Storage = new Storage();

export const createStore = (name = "walletStorage") => {

  storage = new Storage({

    name,
    driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
  });

  storage.create();
}


export const set = async (key:string, val:any) => {

  await storage.set(key, val);
}

export const get = async (key:string) => {

  return await storage.get(key);
}

export const remove = async (key:string) => {

  await storage.remove(key);
}

export const clear = async () => {

  await storage.clear();
}

export const setObject = async (key:string, id:string, val:any) => {

  try {
    const all = await storage.get(key);
    let objIndex = 0;
    if (all) objIndex = await all.findIndex((a: { id: string; }) => parseInt(a.id) === parseInt(id));

    all[objIndex] = val;
    await set(key, all);
    return true;
  } catch (e) {
    return false;
  }

}

export const setNewObject = async (key:string, val:any) => {

  try {
    let value = { ...val };

    let all = await storage.get(key);
    let objIndex = 0;
    let aux = 0;

    if (all){
      objIndex = maxId(all);
      if (objIndex >= 0) aux += 1;
      else objIndex = 0;

      value["id"] = objIndex+aux;
      all[objIndex+aux] = value
    } else {
      value["id"] = 0;
      objIndex = 0;
      all = Array(1).fill(value);
    }

    await set(key, all);
    return objIndex+aux;
  } catch (e) {
    console.log("error");
    console.log(e);
    return -1;
  }

}

export const removeObject = async (key:string, id:string) => {

  const all = await storage.get(key);
  const objIndex = await all.findIndex((a: { id: string; }) => {
    if (a !== undefined) return parseInt(a.id) === parseInt(id);
    else return false;
  });

  all.splice(objIndex, 1);
  set(key, all);
}

export const getObject = async (key:string, id:string) => {

  try {
    const all = await storage.get(key);
    const obj = await all.filter((a: { id: string; }) => {
      if (a !== undefined) return parseInt(a.id) === parseInt(id);
      else return false;
    })[0];
    return obj;
  } catch (e) {
    console.log(e);
  }

}