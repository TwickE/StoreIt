"use client";

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Models } from "node-appwrite";
import { getFiles } from "@/lib/actions/file.actions";


const Search = () => {
    const [query, setQuery] = useState("")
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("query") || "";
    const [results, setResults] = useState<Models.Document[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchFiles = async () => {
            const files = await getFiles({ searchText: query });

            setResults(files.documents);
            setOpen(true);
        }

        fetchFiles();
    }, [query])

    useEffect(() => {
        if (!searchQuery) {
            setQuery("");
        }
    }, [searchQuery])

    return (
        <div className="search">
            <div className="search-input-wrapper">
                <Image
                    src="/assets/icons/search.svg"
                    alt="search"
                    width={24}
                    height={24}
                />
                <Input
                    value={query}
                    placeholder="Search..."
                    onChange={(e) => setQuery(e.target.value)}
                    className="search-input"
                />
                {open && (
                    <ul className="search-result">
                        {results.length > 0 ? (
                            results.map((file) => (
                                <li key={file.$id}>
                                    {file.name}
                                </li>
                            ))
                        ) : (
                            <p className="empty-result">No files found</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Search