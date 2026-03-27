import type {RightColumnProps} from "../types.ts";
import WorkSection from "./sections/WorkSection.tsx";
import BuilderSection from "./sections/BuilderSection.tsx";
import BeyondDeskSection from "./sections/BeyondDeskSection.tsx";

function Connect() {
    return null;
}

export default function RightColumn({ sectionRefs, onHover }: RightColumnProps) {
    const { work, builder, personal, connect } = sectionRefs;

    return (
        <div className="px-8 py-10 justify-between">
            <div ref={work} data-section="work" className="h-screen ">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    The Work
                </h1>
                <WorkSection/>
            </div>
            <div ref={builder} data-section="builder" className="h-screen">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    The Builder
                </h1>
                <BuilderSection />
            </div>
            <div ref={personal} data-section="personal" className="h-screen">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    Beyond the Desk
                </h1>
                <BeyondDeskSection/>
            </div>
            <div ref={connect} data-section="connect" className="h-screen">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    Connect
                </h1>
                <Connect />
            </div>
        </div>
    )
}