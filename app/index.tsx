import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../services/supabase';

type QuoteRow = {
  id: number;
  quote: string;
  band: string;
  album: string;
  song: string;
  year: number;
  active_date: string;
};

function getLocalDateString(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
}

async function shareMetalQuote(q: QuoteRow) {
  const body = `"${q.quote}"\n— ${q.band}, ${q.album} (${q.year})\n#MetalDailyQuote`;
  try {
    await Share.share({ message: body });
  } catch {}
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState<QuoteRow | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const today = getLocalDateString();
        const { data, error } = await supabase
          .from('quotes')
          .select('id, quote, band, album, song, year, active_date')
          .eq('active_date', today)
          .maybeSingle();

        if (error) {
          const networkError = /network|failed to fetch|fetch failed/i.test(error.message);
          setMessage(networkError
            ? 'No connection. Come back later, warrior.'
            : 'No quote today. The silence is also metal.');
          return;
        }
        if (!data) {
          setMessage('No quote today. The silence is also metal.');
          return;
        }
        setQuote(data as QuoteRow);
      } catch (err) {
        const text = err instanceof Error ? err.message : String(err);
        const networkError = /network|failed to fetch|fetch failed/i.test(text);
        setMessage(networkError
          ? 'No connection. Come back later, warrior.'
          : 'No quote today. The silence is also metal.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#cc0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>METAL DAILY QUOTE</Text>

      {quote ? (
        <>
          <View style={styles.centerBlock}>
            <Text style={styles.deco}>🤘</Text>
            <Text style={styles.quoteText}>"{quote.quote}"</Text>
            <View style={styles.divider} />
            <Text style={styles.meta}>
              {quote.band} • {quote.song}
            </Text>
            <Text style={styles.meta}>
              {quote.album} • {quote.year}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.shareBtn, pressed && { opacity: 0.75 }]}
            onPress={() => shareMetalQuote(quote)}
          >
            <Text style={styles.shareBtnText}>SHARE THIS QUOTE</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.centerBlock}>
          <Text style={styles.deco}>🤘</Text>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    padding: 32,
  },
  appTitle: {
    fontSize: 11,
    color: '#888888',
    letterSpacing: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 48,
    marginBottom: 8,
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deco: {
    fontSize: 32,
    marginBottom: 24,
  },
  quoteText: {
    color: '#ffffff',
    fontSize: 26,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#333333',
    width: '80%',
    marginVertical: 24,
  },
  meta: {
    color: '#888888',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 22,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  shareBtn: {
    backgroundColor: '#cc0000',
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: 'center',
    marginBottom: 24,
  },
  shareBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
});