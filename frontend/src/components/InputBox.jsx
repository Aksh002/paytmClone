export function InputBox({placeholder,label,onChange}){
    return <div>
        <div className="max-w-sm">
            <label htmlFor="input-label" className="text-left block text-md font-medium  dark:text-black py-2">{label}</label>
            <input onChange={onChange} type="email" id="input-label" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder={placeholder}/>
        </div>
    </div>
}