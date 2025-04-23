
import Image from "next/image"
import { FacebookIcon, GoogleIcon, GithubIcon, LinkedinIcon, WhatsappIcon, InstagramIcon } from "../socialIcons"


const RootTeam = () => {

    const teamMembers = [
        {
            name: "Ezza Irshad",
            role: "Front-End Developer",
            image: "/images/team_1.png",
        },
        {
            name: "Aneela Kiran",
            role: "BackEnd Developer",
            image: "/images/team_2.png",
        }
    ]

    return (
        <div id="team" className="w-full px-2.5 py-35 mt-6" style={{ background: "url('/images/team_bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-16 max-sm:items-center">
                    <div>
                        <h2 className="text-[#121211] text-[40px] font-semibold">Our Talented Team</h2>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
                        {
                            teamMembers.map((member, index) => (
                                <div key={index} className="flex items-center max-sm:flex-col max-sm:max-w-[385px] p-1 rounded-[28px] bg-white shadow-[0_4px_12px_2px_rgba(0,0,0,0.15)]">
                                    <div className="flex-1">
                                    <Image src={member.image} alt="team_1" width={372} height={400} className="rounded-3xl" />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between p-6 h-full">
                                        <div className="flex flex-col gap-3 text-[#74726f]">
                                            <span className=" text-xs ">{member.role}</span>
                                            <h3 className="text-[#121211] text-[32px]/10 font-semibold mb-2 2xl:mb-8">{member.name}</h3>
                                            <p>Final-year students combining skills and vision to create something meaningful and innovative.</p>
                                        </div>
                                        <div className="flex justify-between max-sm:mt-10 sm:gap-8 items-center xl:max-2xl:mt-5 ">

                                            <a href="" className="cursor-pointer"><GoogleIcon /></a>

                                            <a href="" className="cursor-pointer"><FacebookIcon /></a>

                                            <a href="" className="cursor-pointer"><GithubIcon /></a>

                                            <a href="" className="cursor-pointer"><InstagramIcon /></a>

                                            <a href="" className="cursor-pointer"><LinkedinIcon /></a>

                                            <a href="" className="cursor-pointer"><WhatsappIcon /></a>


                                        </div>
                                    </div>
                                </div>
                            )
                        )  
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RootTeam