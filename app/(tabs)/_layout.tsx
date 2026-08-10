import React from "react";
import { Tabs } from "expo-router";
import { CustomTabBar } from "../../components/CustomTabBar";
import { CustomHeader } from "../../components/CustomHeader";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          header: () => (
            <CustomHeader
              title="HijaLearn"
              subtitle="Edukasi Hijaiyah & Surat Pendek"
            />
          )
        }}
      />
      <Tabs.Screen
        name="hijaiyah"
        options={{
          title: "Hijaiyah",
          header: () => (
            <CustomHeader
              title="Huruf Hijaiyah"
              subtitle="28 Huruf & Pelafalan"
            />
          )
        }}
      />
      <Tabs.Screen
        name="surat"
        options={{
          title: "Surat",
          header: () => (
            <CustomHeader
              title="Surat-surat Pendek"
              subtitle="Juz 30 & Audio"
            />
          )
        }}
      />
      <Tabs.Screen
        name="doa"
        options={{
          title: "Doa",
          header: () => (
            <CustomHeader
              title="Doa-doa Seharian"
              subtitle="20 Doa Harian & Terjemahan"
            />
          )
        }}
      />
      <Tabs.Screen
        name="progres"
        options={{
          title: "Progres",
          header: () => (
            <CustomHeader
              title="Progres & Badge"
              subtitle="Pencapaian Belajar"
            />
          )
        }}
      />
    </Tabs>
  );
}
