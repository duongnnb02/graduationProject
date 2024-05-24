import React, {useState, createContext} from "react";

const DeviceContext = createContext();

const DeviceProvider = ({children}) => {
    const [device, setDevice] = useState([]);

    return (
        <DeviceContext.Provider value={[device, setDevice]}>
            {children}
        </DeviceContext.Provider>
    )
}

export {DeviceContext, DeviceProvider};