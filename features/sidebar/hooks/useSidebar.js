"use client"
import React, {useEffect, useState} from "react";
import { CenterBody, RightBody, SideBody, SideIcon, SideItem } from "../components/Sidebar";

export default function useSidebar(children) {
    const [openNum, setNumber] = useState(-1);
    const [center, setCenter] = useState();
    const [right, setRight] = useState();
    const [sideIcons, setSideIcons] = useState([]);
    const [sideBodies, setSideBodies] = useState([]);
    const [loading, setLoading] = useState(true);

    const selectNumber = (num) => {
        if(openNum != num) {
            setNumber(num);
        } else {
            setNumber(-1)
        }
    };

    useEffect(() => {
        const childrenArray = React.Children.toArray(children);
        setCenter(childrenArray.find((child) => React.isValidElement(child) && child.type == CenterBody));
        setRight(childrenArray.find((child) => React.isValidElement(child) && child.type == RightBody));
        const SideItems = childrenArray.filter((child) => React.isValidElement(child) && child.type == SideItem);
        const sideIcons = [];
        const sideBodies = [];
        SideItems.map((child, index) => {
            const sides = React.Children.toArray(child.props.children);
            sideIcons.push(sides.find((child) => React.isValidElement(child) && child.type == SideIcon));
            sideBodies.push(sides.find((child) => React.isValidElement(child) && child.type == SideBody));
        });
        setSideIcons(sideIcons);
        setSideBodies(sideBodies);
        setLoading(false)
    }, [children])

    return [openNum, selectNumber, center, right, sideIcons, sideBodies, loading];

}