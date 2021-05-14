import React from "react";
import RegisterRoomBedType from "./RegisterRoomBedTypes";
import { useSelector } from "../../../store";
import RegisterRoomPublicBedTypes from "./RegisterRoomPublicBedTypes";


const RegisterRoomBedlist: React.FC = () => {
    const bedList = useSelector( (state) => state.registerRoom.bedList);
    
    return(
        
        <ul className="register-room-bed-type-list-wrapper">
            {bedList.map((bedroom) => (
                <RegisterRoomBedType bedroom={bedroom} />
            ))}
            <RegisterRoomPublicBedTypes />
        </ul>
    )
};


export default RegisterRoomBedlist;