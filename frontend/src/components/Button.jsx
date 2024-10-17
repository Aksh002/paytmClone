export function Button({label,onClick}){
    return <div>
        <button onClick={onClick} type="button" className="text-center py-2.5 px-20 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-800  hover:border-gray-500 hover:text-gray-500 focus:outline-none focus:border-gray-500 focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-gray-800 dark:text-black dark:hover:text-neutral-300 dark:hover:border-neutral-300">
            {label}
        </button>
    </div>
}

export function GreenButton({label,onClick}){
    return <div>
        <button onClick={onClick} type="button" className="text-center py-2.5 px-20 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border text-white bg-green-500 border-black  hover:border-green-200  focus:outline-none focus:border-green-500 hover:bg-green-200 disabled:opacity-50 disabled:pointer-events-none dark:border-green-500 dark:text-white dark:hover:text-neutral-300 dark:hover:border-neutral-300">
            {label}
        </button>
    </div>
}