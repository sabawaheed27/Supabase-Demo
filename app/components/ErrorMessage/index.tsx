
const ErrorMessage= ({message}: {message: string})=>{
    return(
        <div className="text-red-500">{message}</div>
    )
}
export default ErrorMessage;

//It uses object destructuring {message} to directly get the message prop from the props object.
//The {message: string} part is TypeScript, which defines the type for the props. It says that this 
//component expects to receive an object with one property, message, which must be a string. This helps 
// prevent bugs by ensuring the component always gets the data it expects.