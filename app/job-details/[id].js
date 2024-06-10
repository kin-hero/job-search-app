import { useCallback, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Share,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import {
  Company,
  JobAbout,
  JobFooter,
  JobTabs,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";
// import * as Sharing from "expo-sharing";

const tabs = ["About", "Qualifications", "Responsibilities"];

const jobDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const { data, isLoading, error, reFetch } = useFetch("job-details", { job_id: params.id });

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reFetch();
    setRefreshing(false);
  }, []);

  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return (
          <Specifics
            title="Qualifications"
            points={data[0].job_highlights?.Qualifications ?? ["N/A"]}
          />
        );
        break;
      case "About":
        return <JobAbout info={data[0].job_description ?? ["N/A"]} />;
        break;
      case "Responsibilities":
        return (
          <Specifics
            title="Responsibilities"
            points={data[0].job_highlights?.Responsibilities ?? ["N/A"]}
          />
        );
        break;
      default:
        break;
    }
  };

  const pressShare = async () => {
    console.log("job title", data[0].job_title);
    console.log("job description", data[0].job_description);
    console.log("job url", data[0].job_google_link);

    try {
      const result = await Share.share({
        title: data[0].job_title,
        message: data[0].job_description,
        url: data[0].job_google_link,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("shared with activity type: ", result.activityType);
        } else {
          console.log("shared");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed");
      }
    } catch (error) {
      console.log("error in sharing to sns", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn
              iconUrl={icons.share}
              dimension="60%"
              handlePress={pressShare}
              icon="share"
            />
          ),
          headerTitle: "",
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {isLoading ? (
            <ActivityIndicator size="large" colors={COLORS.primary} />
          ) : error ? (
            <Text>Something Went Wrong</Text>
          ) : data.length === 0 ? (
            <Text>No Data Available</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data[0].employer_logo}
                jobTitle={data[0].job_title}
                companyName={data[0].employer_name}
                location={data[0].job_country}
              />
              <JobTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
              {displayTabContent()}
            </View>
          )}
        </ScrollView>
        <JobFooter
          url={data[0]?.job_google_link ?? "https://careers.google.com/jobs/results/"}
          id={params.id}
        />
      </>
    </SafeAreaView>
  );
};

export default jobDetails;
