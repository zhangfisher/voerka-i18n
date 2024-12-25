import { formatDateTime } from "flex-tools/misc/formatDateTime"
 
 
function formatTime(value:number ,template="HH:mm:ss"){    
    return formatDateTime(value,template,{})
}
