import {WORK_CARDS} from "../../data.ts";
import WorkCard from "../WorkCard.tsx";

export default function WorkSection() {
    return (
        <div className="flex flex-col items-center py-6">
            <div className="flex flex-col gap-6 w-full">
                {WORK_CARDS.map((card, index) => (
                    <WorkCard
                        key={card.name}
                        card={card}
                        delay={index * 0.15}
                    />
                ))}
            </div>
        </div>
    );
}