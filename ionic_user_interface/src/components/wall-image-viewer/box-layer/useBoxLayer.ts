import Konva from 'konva';
import { Ref, ref } from 'vue';

import { NumberMode, SelectMode, TapeMode } from '@/components/wall-image-viewer/types';
import { Box } from '@/components/wall-image-viewer/getBoundingBoxes';
import { useBoundingBox } from './useBoundingBox';
import { UseBoxLayer, BoundingBox } from './types';

export function useBoxLayer(
  selectedMode: Ref<SelectMode>,
  tapeMode: Ref<TapeMode>,
  numberMode: Ref<NumberMode>,
): UseBoxLayer {
  const boxLayer = new Konva.Layer();
  let boundingBoxes: BoundingBox[] = [];
  const handholdPositionArr = ref<Array<number>>([]);

  const clearBoxLayer = () => {
    boxLayer.clear();
    boxLayer.destroyChildren();
    boxLayer.batchDraw();
  };

  /**
   * Boxes are added to the layer and given an ID each
   * ID assignment assumes that after a box is added to layer, it will not be removed
   */
  const addBoxLayerBoundingBoxes = (boxes: Box[]) => {
    const currNumBoundingBoxes = boundingBoxes.length;
    const newBoundingBoxes = boxes.map((box, idx) => {
      const { x, y, w, h } = box;
      const { registerBoundingBox, resizeBoundingBox, resetBoundingBox } = useBoundingBox(
        boxLayer,
        selectedMode,
        tapeMode,
        numberMode,
        handholdPositionArr,
      );
      registerBoundingBox(idx + currNumBoundingBoxes, {
        x,
        y,
        width: w,
        height: h,
      });
      return { boxId: idx + currNumBoundingBoxes, resizeBoundingBox, resetBoundingBox };
    });
    boundingBoxes = [...boundingBoxes, ...newBoundingBoxes];
    boxLayer.batchDraw();
  };

  const resizeBoxLayer = (factor: number) => {
    for (const bbox of boundingBoxes) {
      const { resizeBoundingBox } = bbox;
      resizeBoundingBox(factor);
    }
    boxLayer.batchDraw();
  };

  const resetBoxLayerToUnSelected = () => {
    for (const bbox of boundingBoxes) {
      const { resetBoundingBox } = bbox;
      resetBoundingBox();
    }
    boxLayer.batchDraw();
  };

  return {
    boxLayer,
    resizeBoxLayer,
    addBoxLayerBoundingBoxes,
    clearBoxLayer,
    resetBoxLayerToUnSelected,
  };
}
