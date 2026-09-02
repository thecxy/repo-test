import { useEffect, useState } from "react";

export const useRenderFinish = (finishTime = 200) => {
    const [renderLoading, setRenderLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRenderLoading(false);
        }, finishTime);

        return () => {
            setRenderLoading(true);
            clearInterval(timer);
        };
    }, [finishTime]);

    return {
        renderLoading,
    };
};
