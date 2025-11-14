import { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Download, RefreshCw } from 'lucide-react';

export function ThumbnailDesignerPage() {
  const [logoSize, setLogoSize] = useState([50]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-white mb-2">Thumbnail Designer</h1>
        <p className="text-[#9CA3AF]">Preview and customize auto-generated thumbnails.</p>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backdrop Preview */}
        <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6">
          <h3 className="text-white mb-4">Backdrop Preview</h3>
          <div className="aspect-video bg-[#374151] rounded-xl flex items-center justify-center">
            <p className="text-[#9CA3AF]">Movie Backdrop Image</p>
          </div>
        </div>

        {/* Logo Overlay Preview */}
        <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6">
          <h3 className="text-white mb-4">Logo Overlay Preview</h3>
          <div className="aspect-video bg-[#374151] rounded-xl flex items-center justify-center relative">
            <p className="text-[#9CA3AF]">Backdrop + Logo</p>
            <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded text-black text-xs">
              LOGO
            </div>
          </div>
        </div>

        {/* Center Composition */}
        <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6">
          <h3 className="text-white mb-4">Center Composition</h3>
          <div className="aspect-video bg-[#374151] rounded-xl flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white px-6 py-3 rounded text-black">
                CENTERED LOGO
              </div>
            </div>
          </div>
        </div>

        {/* Final 16:9 Mockup */}
        <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6">
          <h3 className="text-white mb-4">Final 16:9 Mockup</h3>
          <div className="aspect-video bg-[#374151] rounded-xl flex items-center justify-center relative overflow-hidden">
            <p className="text-[#9CA3AF]">Final Thumbnail</p>
            <div 
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded"
              style={{ transform: `scale(${logoSize[0] / 50})` }}
            >
              <p className="text-black text-sm">LOGO</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1F2937] rounded-2xl shadow-sm p-6">
        <h3 className="text-white mb-6">Controls</h3>
        <div className="space-y-6">
          {/* Logo Size Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white">Logo Size</label>
              <span className="text-[#9CA3AF]">{logoSize[0]}%</span>
            </div>
            <Slider
              value={logoSize}
              onValueChange={setLogoSize}
              min={25}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          {/* Fallback Mode Indicator */}
          <div className="flex items-center justify-between p-4 bg-[#374151] rounded-xl">
            <span className="text-white">Fallback Mode</span>
            <span className="px-3 py-1 bg-[#065F46] text-[#D1FAE5] rounded-full text-sm">
              Active
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Download Sample
            </Button>
            <Button variant="outline" className="flex-1 gap-2">
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
