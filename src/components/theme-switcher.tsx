"use client";

import clsx from "clsx";
import { Button } from "components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeSwitcherProps {
	renderSwitcher?: boolean;
	className?: string;
}

const ThemeSwitcher = ({ renderSwitcher, className }: ThemeSwitcherProps) => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const ICON_SIZE = 16;

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
	};

	if (renderSwitcher) {
		// Direct sun/moon switcher button for light/dark mode
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
				className={clsx(className)}
			>
				{theme === "light" ? (
					<Sun size={ICON_SIZE} className="text-muted-foreground" />
				) : (
					<Moon size={ICON_SIZE} className="text-muted-foreground" />
				)}
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className={clsx(className)}>
					{theme === "light" ? (
						<Sun
							key="light"
							size={ICON_SIZE}
							className={"text-muted-foreground"}
						/>
					) : theme === "dark" ? (
						<Moon
							key="dark"
							size={ICON_SIZE}
							className={"text-muted-foreground"}
						/>
					) : (
						<Laptop
							key="system"
							size={ICON_SIZE}
							className={"text-muted-foreground"}
						/>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className={clsx("w-content", className)}
				align="start"
			>
				<DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
					<DropdownMenuRadioItem className="flex gap-2" value="light">
						<Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
						<span>Light</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="flex gap-2" value="dark">
						<Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
						<span>Dark</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem className="flex gap-2" value="system">
						<Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
						<span>System</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export { ThemeSwitcher };
