
import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface spotResponse {
  latitude: number;
  longitude: number;
  kor_name: string;
  eng_name: string;
  description: string;
  address: string;
  zip: string;
  url: string;
  image_url: string;
  map_url: string;
  likes: number;
  satisfaction: number;
  spot_category: number;
  phone_number: string;
  business_status: boolean;
  business_hours: string;
  order: number;
  day_x: number;
  spot_time: string;
  drivingTime?: string;
}

interface PlanMapProps {
  spots: spotResponse[];
  selectedDay: number;
}

const PlanMap: React.FC<PlanMapProps> = ({ spots, selectedDay }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780),
      level: 8,
    });

    const daySpots = spots.filter((spot) => spot.day_x === selectedDay);
    const bounds = new window.kakao.maps.LatLngBounds();

    daySpots.forEach((spot) => {
      const markerPosition = new window.kakao.maps.LatLng(
        spot.latitude,
        spot.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
      bounds.extend(markerPosition);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px; font-size:12px;">${spot.kor_name}</div>`,
      });
      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infowindow.open(map, marker);
      });
      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.close();
      });
    });

    if (daySpots.length > 0) {
      map.setBounds(bounds);
    }
  }, [spots, selectedDay]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default PlanMap;
