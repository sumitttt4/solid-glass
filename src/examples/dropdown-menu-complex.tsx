"use client"

import * as React from "react"
import {
  BellIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  FolderSearchIcon,
  HelpCircleIcon,
  KeyboardIcon,
  LanguagesIcon,
  LayoutIcon,
  LogOutIcon,
  MailIcon,
  MonitorIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PaletteIcon,
  SaveIcon,
  SettingsIcon,
  ShieldIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownMenuComplex() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    sms: false,
    push: true,
  })
  const [theme, setTheme] = React.useState("light")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Complex menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>File</DropdownMenuLabel>
          <DropdownMenuItem>
            <FileIcon />
            New file
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderIcon />
            New folder
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderOpenIcon />
              Open recent
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Recent projects</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileCodeIcon />
                    Project Alpha
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCodeIcon />
                    Project Beta
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MoreHorizontalIcon />
                      More projects
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <FileCodeIcon />
                          Project Gamma
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileCodeIcon />
                          Project Delta
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FolderSearchIcon />
                    Browse...
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SaveIcon />
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Export
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={notifications.email}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, email: checked === true })
            }
          >
            <EyeIcon />
            Show sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={notifications.sms}
            onCheckedChange={(checked) =>
              setNotifications({ ...notifications, sms: checked === true })
            }
          >
            <LayoutIcon />
            Show status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PaletteIcon />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value="light">
                      <SunIcon />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <MoonIcon />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <MonitorIcon />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SettingsIcon />
              Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <KeyboardIcon />
                    Keyboard shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LanguagesIcon />
                    Language
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <BellIcon />
                      Notifications
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>
                            Notification types
                          </DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            checked={notifications.push}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                push: checked === true,
                              })
                            }
                          >
                            <BellIcon />
                            Push notifications
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: checked === true,
                              })
                            }
                          >
                            <MailIcon />
                            Email notifications
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ShieldIcon />
                    Privacy & Security
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HelpCircleIcon />
            Help & Support
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileTextIcon />
            Documentation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <LogOutIcon />
            Sign out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
