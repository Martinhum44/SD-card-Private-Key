import Web3 from "web3"
import PropTypes from "prop-types"
import React, {useState, useEffect} from "react"

type Props = {
    contract: any,
    function: string,
    address: string,
    color: string,
    backgroundColor: string,
    text: string,
    params: any[],
    value: number,
    callback: Function
}

const Web3Button:React.FC<Props> = (props: Props) => {
    const [buttonStyle, setButtonStyle] = useState({
        width: "150px",
        border: "none",
        height: "50px",
        borderRadius: "10px",
        color: props.color || "white",
        backgroundColor: props.backgroundColor || "black",
        opacity: "1",
        fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "18px",
        display: props.contract && props.address != null ? "block" : "none",
        marginBottom: "10px"
    })

    useEffect(() => {
        setButtonStyle(bs => ({...bs, display: props.contract && props.address != null ? "block" : "none"}))
    }, [props.address, props.contract])

    console.log(props.contract, props.address)

    if(!props.function){
        throw new Error("You must specifiy the function to call.")
    }

    function handleHover(){
        setButtonStyle(style => ({...style, opacity:"0.9"}))
    }

    function handleLeave(){
        setButtonStyle(style => ({...style, opacity: "1"}))
    }

    async function call(){
        const func = props.contract.methods[props.function]
        if(props.params){
            await func(...props.params).send({from: props.address, value: props.value || 0})  
        } else {
            await func().send({from: props.address, value: props.value || 0})
        }
        if(props.callback){
            await props.callback()
        }
    }

    return (
        <div style={{display:"flex", justifyContent:"center"}}>
            <button style={buttonStyle} onClick={call} onMouseOver={handleHover} onMouseLeave={handleLeave}>{props.text || "Default"}</button> 
        </div>
    ) 
}

export default Web3Button

