import React from "react";

interface CustomButtonProps {
    buttonName: string;
    onClickFn: any
}

const CustomButton = ({buttonName, onClickFn}: CustomButtonProps) => {

    return (
        <button
            className={'customButton'}
            type={"button"}
            name={buttonName}
            onClick={onClickFn}
        >{buttonName}</button>
    )
}

export default CustomButton;
