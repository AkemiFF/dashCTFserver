"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const router = useRouter();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    const languages = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
    ];

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        router.push(router.pathname, router.asPath, { locale: lang });
        setCurrentLanguage(lang);
    };

    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-[150px] justify-start">
                    {languages.find((lang) => lang.code === (currentLanguage ?? "en"))?.flag ?? "🇬🇧"}
                    <span className="ml-2">{currentLanguage?.toUpperCase() ?? "EN"}</span>
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                            {languages.map((lang) => (
                                <CommandItem key={lang.code} onSelect={() => changeLanguage(lang.code)}>
                                    <span>{lang.flag}</span>
                                    <span className="ml-2">{lang.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default LanguageSwitcher;