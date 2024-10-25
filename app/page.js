"use client"
import { CenterBody, RightBody, Sidebar, SideBody, SideIcon, SideItem } from "@/features/sidebar/components/Sidebar";
import { FaPlus, FaDatabase, FaLayerGroup, FaGear } from "react-icons/fa6";

export default function Home() {
    return (
        <div>
            <Sidebar>
                <SideItem>
                    <SideIcon>
                        <FaLayerGroup />
                    </SideIcon>
                    <SideBody>
                        hello
                    </SideBody>
                </SideItem>
                <SideItem>
                    <SideIcon>
                        <FaPlus />
                    </SideIcon>
                    <SideBody>
                        good
                    </SideBody>
                </SideItem>
                <SideItem>
                    <SideIcon>
                        <FaDatabase />
                    </SideIcon>
                    <SideBody>
                        bad
                    </SideBody>
                </SideItem>
                <CenterBody>
                    hoge
                </CenterBody>
                <RightBody>
                    huga
                </RightBody>
            </Sidebar>
        </div>
    );
}
