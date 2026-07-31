import cellomegaScienceBg from "../assets/figma-home/cellomega-science-bg.png";
import glutaraScienceBg from "../assets/science/glutara-lifestyle.png";
import brainBoostScienceBg from "../assets/science/creagen-brain-boost-lifestyle.png";
import rawPowerScienceBg from "../assets/science/creagen-raw-power-lifestyle.png";
import femmeEnergyScienceBg from "../assets/science/creagen-femme-energy-lifestyle.png";
import proPowerScienceBg from "../assets/science/creagen-pro-power-lifestyle.png";
import longevityScienceBg from "../assets/science/longevity-plus-lifestyle.png";

export interface ScienceVisualConfig {
  backgroundImage: string;
  backgroundImageAlt: string;
  backgroundPosition?: string;
}

// TODO: Swap each fallback visual for a dedicated product-specific lifestyle image if/when it is supplied.
export const SCIENCE_VISUALS: Record<string, ScienceVisualConfig> = {
  "longevity-plus": {
    backgroundImage: longevityScienceBg,
    backgroundImageAlt: "LONgevity+ coastal vitality lifestyle visual",
    backgroundPosition: "center right",
  },
  "cellomega-plus": {
    backgroundImage: cellomegaScienceBg,
    backgroundImageAlt: "CellOmega+ coastal lifestyle visual",
    backgroundPosition: "center right",
  },
  "creagen-brain-boost": {
    backgroundImage: brainBoostScienceBg,
    backgroundImageAlt: "Creagen Brain Boost focus and productivity lifestyle visual",
    backgroundPosition: "center right",
  },
  "creagen-femme-energy": {
    backgroundImage: femmeEnergyScienceBg,
    backgroundImageAlt: "Creagen Femme Energy wellness lifestyle visual",
    backgroundPosition: "center right",
  },
  "creagen-raw-power": {
    backgroundImage: rawPowerScienceBg,
    backgroundImageAlt: "Creagen Raw Power strength lifestyle visual",
    backgroundPosition: "center right",
  },
  "creagen-pro-power": {
    backgroundImage: proPowerScienceBg,
    backgroundImageAlt: "Creagen Pro Power performance lifestyle visual",
    backgroundPosition: "center center",
  },
  glutara: {
    backgroundImage: glutaraScienceBg,
    backgroundImageAlt: "Glutara lifestyle visual with warm sunset light",
    backgroundPosition: "center right",
  },
};

export function getScienceVisual(handle: string) {
  return SCIENCE_VISUALS[handle] ?? SCIENCE_VISUALS.glutara;
}
