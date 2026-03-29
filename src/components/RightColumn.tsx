import type {RightColumnProps} from "../types.ts";
import BuilderSection from "./sections/BuilderSection.tsx";
import BeyondDeskSection from "./sections/BeyondDeskSection.tsx";
import WorkSection from "./sections/WorkSecton.tsx";
import ConnectSection from "./sections/ConnectSection.tsx";


export default function RightColumn({ sectionRefs, githubResponse }: RightColumnProps) {
    const { work, builder, personal, connect } = sectionRefs;
    return (
        <div className="px-8 py-10 justify-between">
            <div ref={work} data-section="work" >
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    The Work
                </h1>
                <WorkSection/>
            </div>
            <div ref={builder} data-section="builder" className="pt-5">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    The Builder
                </h1>


                { (githubResponse.error === undefined || githubResponse.error === null) ? (
                    <BuilderSection githubRepos={githubResponse.repos}/>
                ) : (
                    <div className="flex h-screen text-vintage-lavender-300
                     font-primary items-center justify-center text-2xl ">
                        <div>
                            <span>Oops... The connection to Github seems to be broken.</span>
                            <br/>
                            <span>Please check out my </span>
                            <a href="https://github.com/klambo94"
                               target="_blank"
                               rel="noreferrer"
                               onClick={(e) => e.stopPropagation()}
                               className="underline text-vintage-lavender-400
                                               hover:text-vintage-lavender-200
                                                transition-colors">Github</a>
                            <span> for my work!</span>
                        </div>
                    </div>
                    )}


            </div>
            <div ref={personal} data-section="personal" className="pt-15">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    Beyond the Desk
                </h1>
                <BeyondDeskSection/>
            </div>
            <div ref={connect} data-section="connect" className="pt-15">
                {/* Header */}
                <h1 className="font-bitcount text-3xl text-vintage-lavender-300">
                    Connect
                </h1>
                <ConnectSection />
            </div>
        </div>
    )
}