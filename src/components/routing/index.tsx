import {setCurrentPath} from "../../store/actions";

export const handlePath = (path:string) => {
    setCurrentPath(path);
};
