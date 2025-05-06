import { Component } from "solid-js";
import { TimeFormatType } from "../types/game";
import { Bolt, Clock, Timer, Zap } from "lucide-solid";

interface TimeFormatIconProps {
    timeFormatType: TimeFormatType;
}

export const TimeFormatIcon: Component<TimeFormatIconProps> = (props: TimeFormatIconProps) => {
    switch (props.timeFormatType) {
        case "bullet":
            return <Bolt />
        case "blitz":
            return <Zap />
        case "rapid":
            return <Timer />
        case "standard":
            return <Clock />
    }
};