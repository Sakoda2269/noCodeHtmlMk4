"use client"
import React, {useEffect, useState} from "react";
import { CenterBody, RightBody, SideBody, SideIcon, SideItem } from "../components/Sidebar";

export default function useSidebar(children) {
    const [openNum, setNumber] = useState(-1);

    const selectNumber = (num) => {
        if(openNum != num) {
            setNumber(num);
        } else {
            setNumber(-1)
        }
    };

    const childrenArray = React.Children.toArray(children);
    const center = (childrenArray.find((child) => React.isValidElement(child) && child.type == CenterBody));
    const right = (childrenArray.find((child) => React.isValidElement(child) && child.type == RightBody));
    const SideItems = childrenArray.filter((child) => React.isValidElement(child) && child.type == SideItem);
    const sideIcons = [];
    const sideBodies = [];
    SideItems.map((child, index) => {
        const sides = React.Children.toArray(child.props.children);
        sideIcons.push(sides.find((child) => React.isValidElement(child) && child.type == SideIcon));
        sideBodies.push(sides.find((child) => React.isValidElement(child) && child.type == SideBody));
    });

    return [openNum, selectNumber, center, right, sideIcons, sideBodies,];

}