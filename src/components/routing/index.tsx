import {setCurrentPath} from "../../store/actions";

export const handlePath = (path:string, payload?:any) => {
    setCurrentPath({path, payload});
};

