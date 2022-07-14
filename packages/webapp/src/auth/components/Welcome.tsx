import React from "react";

export default React.memo(() => {
    return (
        <div className="flex-1 animate-pluse flex bg-gradient-to-r from-primary-700 to-white">
            <img
                alt=""
                className="w-full h-full object-cover"
                src="https://source.unsplash.com/random"
            />
        </div>
    );
});
