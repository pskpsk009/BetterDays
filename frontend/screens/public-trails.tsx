import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

import {
  COLORS,
  MobileScreen,
  ScreenHeader,
} from "../components/common/AppShell";
import { supabase } from "../../src/lib/supabase";

type PublicTrail = {
  id: string;
  image_path: string;
  mode: "indoor" | "outdoor";
  distance_m: number | null;
  created_at: string;
};

export default function PublicTrailsScreen({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [trails, setTrails] = useState<PublicTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrails = async () => {
    setLoading(true);
    setError(null);
    const result = await supabase
      .from("public_trails")
      .select("id, image_path, mode, distance_m, created_at")
      .order("created_at", { ascending: false });

    if (result.error) {
      setError(result.error.message);
      setTrails([]);
    } else {
      setTrails(result.data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadTrails();
  }, []);

  return (
    <MobileScreen tone="movement">
      {onClose ? (
        <Pressable onPress={onClose} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back to Trail</Text>
        </Pressable>
      ) : (
        <ScreenHeader
          title="Public Trails"
          subtitle="Explore drawings shared by the MyGrowth community."
        />
      )}
      <Text style={styles.title}>Public Trails</Text>
      <Pressable onPress={() => void loadTrails()} style={styles.refreshButton}>
        <Text style={styles.refreshText}>Refresh trails</Text>
      </Pressable>
      {loading && <Text style={styles.message}>Loading public trails...</Text>}
      {!loading && error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && trails.length === 0 && (
        <Text style={styles.message}>No public trails yet.</Text>
      )}
      {!loading &&
        !error &&
        trails.map((trail) => {
          const image = supabase.storage
            .from("public-trails")
            .getPublicUrl(trail.image_path).data.publicUrl;
          return (
            <View key={trail.id} style={styles.trailCard}>
              <SvgUri uri={image} width="100%" height={260} />
              <View style={styles.trailMeta}>
                <Text style={styles.trailMode}>
                  {trail.mode === "indoor" ? "Indoor 2D" : "Outdoor GPS"}
                </Text>
                <Text style={styles.trailDistance}>
                  {trail.distance_m?.toFixed(1) ?? "0.0"} m
                </Text>
              </View>
            </View>
          );
        })}
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  backButton: { alignSelf: "flex-start", paddingVertical: 10 },
  backText: { color: COLORS.teal, fontSize: 13, fontWeight: "800" },
  title: {
    color: COLORS.ink,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 14,
  },
  refreshButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.movementSoft,
  },
  refreshText: { color: "#B96D2C", fontSize: 12, fontWeight: "800" },
  message: { marginTop: 24, color: COLORS.muted, fontSize: 13 },
  error: { marginTop: 24, color: "#B84E4E", fontSize: 12 },
  trailCard: {
    marginTop: 16,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trailImage: {
    width: "100%",
    aspectRatio: 1.35,
    backgroundColor: COLORS.tealSoft,
  },
  trailMeta: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trailMode: { color: COLORS.ink, fontSize: 12, fontWeight: "800" },
  trailDistance: { color: COLORS.movement, fontSize: 12, fontWeight: "800" },
});
